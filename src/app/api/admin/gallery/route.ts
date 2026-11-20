import {
  adminJson,
  requireAdminApiAccess,
  revalidateGalleryPages,
} from "@/lib/adminApi";
import { validateGalleryPayload } from "@/lib/adminValidation";
import {
  createGalleryItemInStore,
  getAdminStoreSnapshot,
} from "@/lib/contentStore";

export async function GET(request: Request) {
  const auth = await requireAdminApiAccess(request);
  if (!auth.ok) return auth.response;

  try {
    const store = await getAdminStoreSnapshot();
    return adminJson({ gallery: store.gallery, updatedAt: store.updatedAt });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error ? error.message : "Không thể tải danh sách ảnh.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApiAccess(request, { requireSameOrigin: true });
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJson({ error: "Payload JSON không hợp lệ." }, { status: 400 });
  }

  const validated = validateGalleryPayload(body);
  if (!validated.ok) {
    return adminJson({ error: validated.error }, { status: 400 });
  }

  try {
    const created = await createGalleryItemInStore(validated.data);
    revalidateGalleryPages();
    return adminJson({ item: created }, { status: 201 });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể thêm ảnh mới vào Supabase.",
      },
      { status: 500 }
    );
  }
}
