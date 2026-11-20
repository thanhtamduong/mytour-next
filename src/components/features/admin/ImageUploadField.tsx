"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { LuCamera, LuLoader2, LuUpload } from "@/components/common/Icons";
import { SmartImage } from "@/components/common/SmartImage";
import { isValidImageUrlString } from "@/lib/adminValidation";

interface ImageUploadFieldProps {
  label: string;
  folder: "tours" | "gallery";
  value: string;
  onChange: (nextUrl: string) => void;
  previewAlt?: string;
}

const MAX_CLIENT_BYTES = 5 * 1024 * 1024;

export function ImageUploadField({
  label,
  folder,
  value,
  onChange,
  previewAlt = "Ảnh xem trước",
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (file.size > MAX_CLIENT_BYTES) {
      setUploadError("Ảnh vượt quá giới hạn 5MB. Vui lòng chọn ảnh nhẹ hơn.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        setUploadError(
          data.error || "Tải ảnh lên thất bại. Vui lòng kiểm tra lại định dạng."
        );
        return;
      }

      onChange(data.url);
    } catch {
      setUploadError("Mất kết nối khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const canPreview = isValidImageUrlString(value);

  return (
    <div className="space-y-3 rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8]/55 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#103F2B]">
          {label}
        </span>
        <span className="text-[11px] font-medium text-[#103F2B]/65">
          Hỗ trợ JPG, PNG, WebP (tối đa 5MB)
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-12 sm:items-center">
        <div className="sm:col-span-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#FBCFE2] bg-white">
            {canPreview ? (
              <SmartImage
                src={value}
                alt={previewAlt}
                sizes="320px"
                className="object-cover"
                fallbackLabel="Ảnh xem trước"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-4 text-center text-[#103F2B]/55">
                <LuCamera className="h-7 w-7 text-[#E13D7D]/70" />
                <span className="text-xs font-medium">
                  Chưa có ảnh hợp lệ
                </span>
              </div>
            )}
            {uploading && (
              <div
                role="status"
                aria-live="polite"
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0B2D1E]/55 text-white backdrop-blur-[2px]"
              >
                <LuLoader2 className="h-6 w-6 animate-spin text-[#F8A4C7]" />
                <span className="text-xs font-bold">Đang tải ảnh lên...</span>
              </div>
            )}
          </div>
        </div>

        <div className="sm:col-span-7 space-y-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E13D7D]/55 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-[#C82564] transition hover:border-[#E13D7D] hover:bg-[#FFF5F8] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploading ? (
              <LuLoader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <LuUpload className="h-4 w-4 shrink-0" />
            )}
            <span>
              {uploading
                ? "Đang tải ảnh lên Supabase Storage..."
                : "Chọn ảnh từ máy tính để tải lên"}
            </span>
          </button>

          <div>
            <label
              htmlFor={`img-url-${folder}`}
              className="mb-1 block text-[11px] font-semibold text-[#103F2B]/70"
            >
              Hoặc dán đường dẫn ảnh (Supabase Storage hoặc Unsplash):
            </label>
            <input
              id={`img-url-${folder}`}
              type="text"
              maxLength={500}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://...supabase.co/storage/v1/object/public/tour-media/... hoặc Unsplash"
              className="w-full rounded-xl border border-[#B2DFC4] bg-white px-3 py-2 text-xs text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
            />
          </div>

          {uploadError && (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
            >
              {uploadError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
