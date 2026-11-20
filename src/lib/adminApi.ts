import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  getAdminSession,
  verifySameOriginRequest,
  type AdminSession,
} from "@/lib/adminAuth";
import { getAdminStoreSnapshot } from "@/lib/contentStore";
import { removeUploadedImage } from "@/lib/mediaStorage";
import { getSupabasePublicStoragePrefix } from "@/lib/supabaseConfig";

export function adminJson(
  body: unknown,
  init: { status?: number; headers?: HeadersInit } = {}
) {
  return NextResponse.json(body, {
    status: init.status ?? 200,
    headers: {
      "Cache-Control": "no-store",
      ...init.headers,
    },
  });
}

export async function requireAdminApiAccess(
  request: Request,
  options: { requireSameOrigin?: boolean } = {}
): Promise<
  | { ok: true; session: AdminSession }
  | { ok: false; response: NextResponse }
> {
  if (options.requireSameOrigin && !verifySameOriginRequest(request)) {
    return {
      ok: false,
      response: adminJson(
        { error: "Yêu cầu không hợp lệ (Origin mismatch)." },
        { status: 403 }
      ),
    };
  }

  const session = await getAdminSession();
  if (!session) {
    return {
      ok: false,
      response: adminJson(
        { error: "Phiên đăng nhập đã hết hạn hoặc không có quyền quản trị." },
        { status: 401 }
      ),
    };
  }

  return { ok: true, session };
}

export function revalidateTourPages(slug?: string) {
  revalidateTag("tours", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/tours/[slug]", "page");
  if (slug) {
    revalidatePath(`/tours/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}

export function revalidateGalleryPages() {
  revalidateTag("gallery", { expire: 0 });
  revalidatePath("/");
}

export async function cleanupUnusedUploadedImage(candidateUrl: unknown) {
  const storagePrefix = getSupabasePublicStoragePrefix();
  if (
    typeof candidateUrl !== "string" ||
    !storagePrefix ||
    !candidateUrl.startsWith(storagePrefix)
  ) {
    return;
  }

  try {
    const snapshot = await getAdminStoreSnapshot();
    const stillReferenced =
      snapshot.tours.some((item) => item.imageUrl === candidateUrl) ||
      snapshot.gallery.some((item) => item.imageUrl === candidateUrl);

    if (!stillReferenced) {
      await removeUploadedImage(candidateUrl);
    }
  } catch {
    // Bỏ qua lỗi cleanup phụ
  }
}
