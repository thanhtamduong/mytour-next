import { NextResponse } from "next/server";
import { adminJson } from "@/lib/adminApi";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  getClientIdentifier,
  isAdminAuthConfigured,
  isAuthorizedAdminUser,
  recordLoginFailure,
  verifySameOriginRequest,
} from "@/lib/adminAuth";
import { createSupabaseRouteResponseClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  if (!verifySameOriginRequest(request)) {
    return adminJson(
      { error: "Yêu cầu không hợp lệ (Origin mismatch)." },
      { status: 403 }
    );
  }

  if (!isAdminAuthConfigured()) {
    return adminJson(
      {
        error:
          "Chưa cấu hình NEXT_PUBLIC_SUPABASE_URL và khóa Supabase trong .env.local.",
      },
      { status: 503 }
    );
  }

  const clientKey = getClientIdentifier(request);
  const rateLimit = checkLoginRateLimit(clientKey);
  if (!rateLimit.allowed) {
    return adminJson(
      {
        error: `Bạn thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${rateLimit.retryAfterSec} giây.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSec),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJson(
      { error: "Dữ liệu đăng nhập không hợp lệ." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return adminJson(
      { error: "Vui lòng nhập email và mật khẩu." },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;
  const rawEmail =
    typeof record.email === "string"
      ? record.email
      : typeof record.username === "string"
        ? record.username
        : "";
  const email = rawEmail.trim().toLowerCase().slice(0, 120);
  const password =
    typeof record.password === "string" ? record.password.slice(0, 200) : "";

  if (!email || !password || !email.includes("@")) {
    return adminJson(
      { error: "Vui lòng nhập đúng email quản trị và mật khẩu." },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    { ok: true, email },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );

  try {
    const supabase = await createSupabaseRouteResponseClient(response);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      recordLoginFailure(clientKey);
      return adminJson(
        { error: "Email hoặc mật khẩu chưa chính xác." },
        { status: 401 }
      );
    }

    const authorized = await isAuthorizedAdminUser(
      data.user.id,
      data.user.email,
      supabase
    );
    if (!authorized) {
      await supabase.auth.signOut();
      recordLoginFailure(clientKey);
      return adminJson(
        {
          error:
            "Tài khoản này chưa được cấp quyền quản trị trong bảng admin_users.",
        },
        { status: 403 }
      );
    }

    clearLoginFailures(clientKey);
    return response;
  } catch {
    return adminJson(
      { error: "Không thể kết nối dịch vụ xác thực Supabase." },
      { status: 500 }
    );
  }
}
