import {
  adminJson,
  cleanupUnusedUploadedImage,
  requireAdminApiAccess,
  revalidateTourPages,
} from "@/lib/adminApi";
import { validateTourPayload } from "@/lib/adminValidation";
import {
  deleteTourInStore,
  getAdminStoreSnapshot,
  updateTourInStore,
} from "@/lib/contentStore";

interface TourRouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: TourRouteContext) {
  const auth = await requireAdminApiAccess(request, { requireSameOrigin: true });
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!id || id.length > 64) {
    return adminJson({ error: "Mã định danh tour không hợp lệ." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return adminJson({ error: "Payload JSON không hợp lệ." }, { status: 400 });
  }

  const validated = validateTourPayload(body);
  if (!validated.ok) {
    return adminJson({ error: validated.error }, { status: 400 });
  }

  try {
    const before = await getAdminStoreSnapshot();
    const previousTour = before.tours.find((t) => t.id === id);
    const updated = await updateTourInStore(id, validated.data);

    if (!updated) {
      return adminJson(
        { error: "Không tìm thấy tour cần cập nhật." },
        { status: 404 }
      );
    }

    if (previousTour && previousTour.imageUrl !== updated.imageUrl) {
      await cleanupUnusedUploadedImage(previousTour.imageUrl);
    }

    revalidateTourPages(updated.slug);
    if (previousTour && previousTour.slug !== updated.slug) {
      revalidateTourPages(previousTour.slug);
    }

    return adminJson({ tour: updated });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể cập nhật tour trên Supabase.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: TourRouteContext) {
  const auth = await requireAdminApiAccess(request, { requireSameOrigin: true });
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!id || id.length > 64) {
    return adminJson({ error: "Mã định danh tour không hợp lệ." }, { status: 400 });
  }

  try {
    const removed = await deleteTourInStore(id);
    if (!removed) {
      return adminJson({ error: "Không tìm thấy tour cần xóa." }, { status: 404 });
    }

    await cleanupUnusedUploadedImage(removed.imageUrl);
    revalidateTourPages(removed.slug);

    return adminJson({ ok: true, deletedId: removed.id });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể xóa tour trên Supabase.",
      },
      { status: 500 }
    );
  }
}
