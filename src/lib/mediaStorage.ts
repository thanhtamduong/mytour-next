import "server-only";

import crypto from "node:crypto";
import {
  SUPABASE_STORAGE_BUCKET,
  getSupabasePublicStoragePrefix,
} from "@/lib/supabaseConfig";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export type UploadFolder = "tours" | "gallery";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

interface DetectedImageType {
  ext: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
}

function detectImageByMagicBytes(bytes: Uint8Array): DetectedImageType | null {
  if (bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: "jpg", mimeType: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { ext: "png", mimeType: "image/png" };
  }

  // WebP: RIFF .... WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { ext: "webp", mimeType: "image/webp" };
  }

  return null;
}

/**
 * Kiểm tra magic bytes rồi upload ảnh lên Supabase Storage bucket "tour-media".
 */
export async function saveUploadedImage(
  file: File,
  folder: UploadFolder
): Promise<
  | { ok: true; url: string; size: number; mimeType: string }
  | { ok: false; status: number; error: string }
> {
  if (file.size <= 0) {
    return { ok: false, status: 400, error: "File ảnh trống." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      status: 413,
      error: "Dung lượng ảnh vượt quá giới hạn 5MB.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImageByMagicBytes(buffer);
  if (!detected) {
    return {
      ok: false,
      status: 400,
      error:
        "Chỉ hỗ trợ file ảnh JPG, PNG hoặc WebP hợp lệ (không nhận SVG hoặc định dạng khác).",
    };
  }

  const safeFolder: UploadFolder = folder === "gallery" ? "gallery" : "tours";
  const objectPath = `${safeFolder}/${crypto.randomUUID()}.${detected.ext}`;

  try {
    const supabase = await createSupabaseServerClient();
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(objectPath, buffer, {
        contentType: detected.mimeType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      return {
        ok: false,
        status: 403,
        error: `Supabase Storage từ chối upload: ${uploadError.message}`,
      };
    }

    const { data: urlData } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(objectPath);

    return {
      ok: true,
      url: urlData.publicUrl,
      size: buffer.length,
      mimeType: detected.mimeType,
    };
  } catch {
    return {
      ok: false,
      status: 500,
      error: "Không thể kết nối tới Supabase Storage để lưu ảnh.",
    };
  }
}

/**
 * Xóa file ảnh trên Supabase Storage bucket nếu thuộc bucket "tour-media".
 */
export async function removeUploadedImage(imageUrl: string): Promise<void> {
  const prefix = getSupabasePublicStoragePrefix();
  if (!prefix || !imageUrl.startsWith(prefix)) return;

  const objectPath = decodeURIComponent(
    imageUrl.slice(prefix.length).split("?")[0] ?? ""
  );
  if (
    !objectPath ||
    objectPath.includes("..") ||
    !/^(tours|gallery)\/[a-zA-Z0-9._-]+$/.test(objectPath)
  ) {
    return;
  }

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.storage.from(SUPABASE_STORAGE_BUCKET).remove([objectPath]);
  } catch {
    // Bỏ qua lỗi dọn file phụ để không làm hỏng luồng chính
  }
}
