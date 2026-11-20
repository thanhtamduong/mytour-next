import { NextResponse } from "next/server";
import { adminJson } from "@/lib/adminApi";
import { isAdminAuthConfigured, verifySameOriginRequest } from "@/lib/adminAuth";
import { createSupabaseRouteResponseClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  if (!verifySameOriginRequest(request)) {
    return adminJson(
      { error: "Yêu cầu không hợp lệ (Origin mismatch)." },
      { status: 403 }
    );
  }

  const response = NextResponse.json(
    { ok: true },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );

  if (!isAdminAuthConfigured()) {
    return response;
  }

  try {
    const supabase = await createSupabaseRouteResponseClient(response);
    await supabase.auth.signOut();
  } catch {
    // Vẫn trả về ok để client refresh lại trạng thái đăng xuất
  }

  return response;
}
