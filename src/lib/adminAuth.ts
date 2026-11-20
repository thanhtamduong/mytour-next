import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getAllowedAdminEmail,
  isSupabaseConfigured,
} from "@/lib/supabaseConfig";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

export interface AdminSession {
  userId: string;
  email: string;
}

interface LoginAttemptBucket {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, LoginAttemptBucket>();

export function isAdminAuthConfigured(): boolean {
  return isSupabaseConfigured();
}

export async function isAuthorizedAdminUser(
  userId: string,
  userEmail: string | undefined,
  existingClient?: SupabaseClient
): Promise<boolean> {
  if (!userId || !userEmail) return false;

  const allowedEmail = getAllowedAdminEmail();
  if (allowedEmail && userEmail.toLowerCase() !== allowedEmail) {
    return false;
  }

  try {
    const supabase = existingClient ?? (await createSupabaseServerClient());
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    return data.user_id === userId;
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return null;
    }

    const authorized = await isAuthorizedAdminUser(
      user.id,
      user.email,
      supabase
    );
    if (!authorized) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
    };
  } catch {
    return null;
  }
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

export function checkLoginRateLimit(clientKey: string): {
  allowed: boolean;
  retryAfterSec: number;
} {
  const now = Date.now();
  const bucket = loginAttempts.get(clientKey);
  if (!bucket || bucket.resetAt <= now) {
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count >= MAX_LOGIN_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSec: 0 };
}

export function recordLoginFailure(clientKey: string): void {
  const now = Date.now();
  const bucket = loginAttempts.get(clientKey);
  if (!bucket || bucket.resetAt <= now) {
    loginAttempts.set(clientKey, {
      count: 1,
      resetAt: now + LOGIN_WINDOW_MS,
    });
    return;
  }
  bucket.count += 1;
}

export function clearLoginFailures(clientKey: string): void {
  loginAttempts.delete(clientKey);
}

/**
 * Chặn request mutation cross-site từ origin lạ khi có header Origin.
 */
export function verifySameOriginRequest(request: Request): boolean {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return true;

  const hostHeader =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!hostHeader) return false;

  try {
    const parsedOrigin = new URL(originHeader);
    return parsedOrigin.host.toLowerCase() === hostHeader.toLowerCase();
  } catch {
    return false;
  }
}
