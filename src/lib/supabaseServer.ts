import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabaseConfig";

/**
 * Tạo Supabase Server Client đọc phiên đăng nhập từ cookies của Next.js App Router.
 * Dùng trong Server Components (bên trong <Suspense>) và Route Handlers.
 */
export async function createSupabaseServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublicKey();
  if (!url || !key) {
    throw new Error(
      "Thiếu cấu hình NEXT_PUBLIC_SUPABASE_URL hoặc key Supabase trong biến môi trường."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Bỏ qua khi gọi trong Server Component (Proxy sẽ làm mới cookie phiên)
        }
      },
    },
  });
}

/**
 * Tạo Supabase Server Client gắn trực tiếp cookie phản hồi lên NextResponse
 * cho các route đăng nhập / đăng xuất.
 */
export async function createSupabaseRouteResponseClient(response: NextResponse) {
  const url = getSupabaseUrl();
  const key = getSupabasePublicKey();
  if (!url || !key) {
    throw new Error(
      "Thiếu cấu hình NEXT_PUBLIC_SUPABASE_URL hoặc key Supabase trong biến môi trường."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}
