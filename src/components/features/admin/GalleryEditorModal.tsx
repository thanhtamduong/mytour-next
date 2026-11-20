"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ImageUploadField } from "@/components/features/admin/ImageUploadField";
import { GALLERY_CATEGORY_LABELS } from "@/lib/adminValidation";
import type {
  GalleryCategory,
  GalleryFormInput,
  PersonalPhotoItem,
} from "@/types/travel";

interface GalleryEditorModalProps {
  isOpen: boolean;
  editingPhoto: PersonalPhotoItem | null;
  onClose: () => void;
  onSaved: (photo: PersonalPhotoItem, mode: "create" | "update") => void;
}

function resolvePhotoString(
  img: PersonalPhotoItem["imageUrl"] | undefined
): string {
  if (!img) return "";
  return typeof img === "string" ? img : img.src;
}

function GalleryEditorForm({
  editingPhoto,
  onClose,
  onSaved,
}: {
  editingPhoto: PersonalPhotoItem | null;
  onClose: () => void;
  onSaved: (photo: PersonalPhotoItem, mode: "create" | "update") => void;
}) {
  const isEditing = editingPhoto !== null;

  const [title, setTitle] = useState(editingPhoto?.title ?? "");
  const [caption, setCaption] = useState(editingPhoto?.caption ?? "");
  const [location, setLocation] = useState(editingPhoto?.location ?? "");
  const [dateLabel, setDateLabel] = useState(
    editingPhoto?.dateLabel ?? "Khoảnh khắc thực tế"
  );
  const [category, setCategory] = useState<Exclude<GalleryCategory, "all">>(
    editingPhoto?.category ?? "leading-tour"
  );
  const [aspect, setAspect] = useState<PersonalPhotoItem["aspect"]>(
    editingPhoto?.aspect ?? "landscape"
  );
  const [imageUrl, setImageUrl] = useState(
    resolvePhotoString(editingPhoto?.imageUrl)
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setErrorMessage(null);
    setSubmitting(true);

    const payload: GalleryFormInput = {
      title: title.trim(),
      caption: caption.trim(),
      location: location.trim(),
      dateLabel: dateLabel.trim() || "Khoảnh khắc thực tế",
      category,
      categoryLabel: GALLERY_CATEGORY_LABELS[category],
      imageUrl: imageUrl.trim(),
      aspect,
    };

    try {
      const endpoint = isEditing
        ? `/api/admin/gallery/${encodeURIComponent(editingPhoto.id)}`
        : "/api/admin/gallery";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        item?: PersonalPhotoItem;
        error?: string;
      };

      if (!response.ok || !data.item) {
        setErrorMessage(data.error || "Không thể lưu hình ảnh.");
        return;
      }

      onSaved(data.item, isEditing ? "update" : "create");
    } catch {
      setErrorMessage("Mất kết nối tới máy chủ khi lưu ảnh.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ImageUploadField
        label="Hình ảnh album cá nhân / dẫn đoàn"
        folder="gallery"
        value={imageUrl}
        onChange={setImageUrl}
        previewAlt={title || "Ảnh album mới"}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="gallery-title"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Tiêu đề khoảnh khắc *
          </label>
          <input
            id="gallery-title"
            type="text"
            required
            maxLength={140}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Đón đoàn khách gia đình tại sân bay Tân Sơn Nhất"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm font-medium text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="gallery-category"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Phân loại *
          </label>
          <select
            id="gallery-category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as Exclude<GalleryCategory, "all">)
            }
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          >
            <option value="leading-tour">Dẫn đoàn &amp; Đón khách</option>
            <option value="inspection">Khảo sát điểm đến</option>
            <option value="portrait">Ảnh cá nhân</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="gallery-aspect"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Tỷ lệ khung ảnh
          </label>
          <select
            id="gallery-aspect"
            value={aspect}
            onChange={(e) =>
              setAspect(e.target.value as PersonalPhotoItem["aspect"])
            }
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          >
            <option value="landscape">Khổ ngang (Landscape)</option>
            <option value="square">Khổ vuông (Square)</option>
            <option value="portrait">Khổ dọc (Portrait)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="gallery-location"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Địa điểm *
          </label>
          <input
            id="gallery-location"
            type="text"
            required
            maxLength={100}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Đà Lạt, Lâm Đồng"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="gallery-date"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Nhãn thời gian / chú thích góc
          </label>
          <input
            id="gallery-date"
            type="text"
            maxLength={50}
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder="Famtrip Đà Lạt"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="gallery-caption"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Câu chuyện / mô tả ngắn *
          </label>
          <textarea
            id="gallery-caption"
            rows={3}
            required
            maxLength={360}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Chia sẻ trải nghiệm thực tế khi khảo sát hoặc dẫn đoàn..."
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2.5 border-t border-[#FCE7F0] pt-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting
            ? "Đang lưu ảnh..."
            : isEditing
              ? "Lưu thay đổi"
              : "Thêm vào Album ảnh"}
        </Button>
      </div>
    </form>
  );
}

export function GalleryEditorModal({
  isOpen,
  editingPhoto,
  onClose,
  onSaved,
}: GalleryEditorModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPhoto ? "Chỉnh sửa ảnh album" : "Tải ảnh mới lên Album"}
      maxWidthClass="max-w-2xl"
    >
      {isOpen && (
        <GalleryEditorForm
          key={editingPhoto?.id ?? "new-photo"}
          editingPhoto={editingPhoto}
          onClose={onClose}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
}
