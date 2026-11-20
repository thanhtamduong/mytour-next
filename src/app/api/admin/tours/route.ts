import {
  adminJson,
  requireAdminApiAccess,
  revalidateTourPages,
} from "@/lib/adminApi";
import { validateTourPayload } from "@/lib/adminValidation";
import { createTourInStore, getAdminStoreSnapshot } from "@/lib/contentStore";

export async function GET(request: Request) {
  const auth = await requireAdminApiAccess(request);
  if (!auth.ok) return auth.response;

  try {
    const store = await getAdminStoreSnapshot();
    return adminJson({ tours: store.tours, updatedAt: store.updatedAt });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách tour.",
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

  const validated = validateTourPayload(body);
  if (!validated.ok) {
    return adminJson({ error: validated.error }, { status: 400 });
  }

  try {
    const created = await createTourInStore(validated.data);
    revalidateTourPages(created.slug);
    return adminJson({ tour: created }, { status: 201 });
  } catch (error) {
    return adminJson(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể tạo tour mới trên Supabase.",
      },
      { status: 500 }
    );
  }
}
