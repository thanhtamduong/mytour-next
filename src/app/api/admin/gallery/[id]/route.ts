import {
  adminJson,
  cleanupUnusedUploadedImage,
  requireAdminApiAccess,
  revalidateGalleryPages,
} from "@/lib/adminApi";
import { validateGalleryPayload } from "@/lib/adminValidation";
import {
  deleteGalleryItemInStore,
  getAdminStoreSnapshot,
  updateGalleryItemInStore,
} from "@/lib/contentStore";

interface GalleryRouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: GalleryRouteContext) {
  const auth = await requireAdminApiAccess(request, { requireSameOrigin: true });
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!id || id.length > 64) {
    return adminJson({ error: "Mã định danh ảnh không hợp lệ." }, { status: 400 });
  }

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
    const before = await getAdminStoreSnapshot();
    const previousItem = before.gallery.find((g) => g.id === id);
    const updated = await updateGalleryItemInStore(id, validated.data);

    if (!updated) {
      return adminJson(
        { error: "Không tìm thấy ảnh cần cập nhật." },
        { status: 404 }
      );
    }

    if (previousItem && previousItem.imageUrl !== updated.imageUrl) {
      await cleanupUnusedUploadedImage(previousItem.imageUrl);
    }

    revalidateGalleryPages();
    return adminJson({ item: updated });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật ảnh trên Supabase.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: GalleryRouteContext) {
  const auth = await requireAdminApiAccess(request, { requireSameOrigin: true });
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!id || id.length > 64) {
    return adminJson({ error: "Mã định danh ảnh không hợp lệ." }, { status: 400 });
  }

  try {
    const removed = await deleteGalleryItemInStore(id);
    if (!removed) {
      return adminJson({ error: "Không tìm thấy ảnh cần xóa." }, { status: 404 });
    }

    await cleanupUnusedUploadedImage(removed.imageUrl);
    revalidateGalleryPages();

    return adminJson({ ok: true, deletedId: removed.id });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể xóa ảnh trên Supabase.",
      },
      { status: 500 }
    );
  }
}
