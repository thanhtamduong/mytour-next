export const SUPABASE_STORAGE_BUCKET = "tour-media";
export const ADVISOR_AVATAR_SENTINEL = "local:advisor-avatar";

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    ""
  );
}

export function getSupabasePublicKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

export function getAllowedAdminEmail(): string {
  return process.env.ADMIN_ALLOWED_EMAIL?.trim().toLowerCase() || "";
}

export function getSupabaseOrigin(): string | null {
  const rawUrl = getSupabaseUrl();
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    if (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      parsed.hostname.length > 0
    ) {
      return parsed.origin;
    }
    return null;
  } catch {
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseOrigin() && getSupabasePublicKey());
}

export function getSupabasePublicStoragePrefix(): string | null {
  const origin = getSupabaseOrigin();
  if (!origin) return null;
  return `${origin}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;
}
