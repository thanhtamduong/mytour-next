import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabaseConfig";

/**
 * Supabase client công khai (stateless, không đọc cookies) dùng cho các hàm
 * đọc dữ liệu public với "use cache" của Next.js 16 Cache Components.
 */
export function createSupabasePublicClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabasePublicKey();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
