import { adminJson, requireAdminApiAccess } from "@/lib/adminApi";
import { saveUploadedImage, type UploadFolder } from "@/lib/mediaStorage";

export async function POST(request: Request) {
  const auth = await requireAdminApiAccess(request, { requireSameOrigin: true });
  if (!auth.ok) return auth.response;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return adminJson(
      { error: "Không thể đọc dữ liệu file tải lên." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return adminJson(
      { error: "Vui lòng chọn file ảnh để tải lên." },
      { status: 400 }
    );
  }

  const rawFolder = formData.get("folder");
  const folder: UploadFolder = rawFolder === "gallery" ? "gallery" : "tours";

  const result = await saveUploadedImage(file, folder);
  if (!result.ok) {
    return adminJson({ error: result.error }, { status: result.status });
  }

  return adminJson(
    {
      url: result.url,
      size: result.size,
      mimeType: result.mimeType,
    },
    { status: 201 }
  );
}
