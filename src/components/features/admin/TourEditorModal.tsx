"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { LuLoader2, LuPlus, LuTrash2 } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ImageUploadField } from "@/components/features/admin/ImageUploadField";
import {
  REGION_DEFAULTS,
  slugifyVietnamese,
} from "@/lib/adminValidation";
import type { TourFormInput, TourPackage, TourRegion } from "@/types/travel";

interface TourEditorModalProps {
  isOpen: boolean;
  editingTour: TourPackage | null;
  onClose: () => void;
  onSaved: (tour: TourPackage, mode: "create" | "update") => void;
}

function resolveImageString(img: TourPackage["imageUrl"] | undefined): string {
  if (!img) return "";
  return typeof img === "string" ? img : img.src;
}

function ListFieldEditor({
  label,
  items,
  placeholder,
  addLabel,
  onChange,
}: {
  label: string;
  items: string[];
  placeholder: string;
  addLabel: string;
  onChange: (nextItems: string[]) => void;
}) {
  const handleItemChange = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...items, ""]);
  };

  const handleRemove = (index: number) => {
    if (items.length <= 1) {
      onChange([""]);
      return;
    }
    onChange(items.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2 rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2]/45 p-3.5 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#145335]">
          {label}
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#186C42] border border-[#B2DFC4] transition hover:bg-[#186C42] hover:text-white cursor-pointer"
        >
          <LuPlus className="h-3 w-3" />
          <span>{addLabel}</span>
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <input
              type="text"
              maxLength={320}
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={`${placeholder} (${index + 1})`}
              className="flex-1 rounded-xl border border-[#B2DFC4] bg-white px-3 py-2 text-xs sm:text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              aria-label={`Xóa mục ${index + 1}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            >
              <LuTrash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TourEditorForm({
  editingTour,
  submitting,
  onSubmittingChange,
  onClose,
  onSaved,
}: {
  editingTour: TourPackage | null;
  submitting: boolean;
  onSubmittingChange: (nextSubmitting: boolean) => void;
  onClose: () => void;
  onSaved: (tour: TourPackage, mode: "create" | "update") => void;
}) {
  const isEditing = editingTour !== null;

  const [title, setTitle] = useState(editingTour?.title ?? "");
  const [slug, setSlug] = useState(editingTour?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [code, setCode] = useState(editingTour?.code ?? "");
  const [destination, setDestination] = useState(
    editingTour?.destination ?? ""
  );
  const [countryOrProvince, setCountryOrProvince] = useState(
    editingTour?.countryOrProvince ?? ""
  );
  const [region, setRegion] = useState<TourRegion>(
    editingTour?.region ?? "vietnam"
  );
  const [regionLabel, setRegionLabel] = useState(
    editingTour?.regionLabel ?? REGION_DEFAULTS.vietnam.label
  );
  const [duration, setDuration] = useState(
    editingTour?.duration ?? "3 Ngày 2 Đêm"
  );
  const [departureFrom, setDepartureFrom] = useState(
    editingTour?.departureFrom ?? "TP.HCM / Hà Nội"
  );
  const [priceLabel, setPriceLabel] = useState(
    editingTour?.priceLabel ?? "Liên hệ báo giá"
  );
  const [originalPriceLabel, setOriginalPriceLabel] = useState(
    editingTour?.originalPriceLabel ?? ""
  );
  const [badgeText, setBadgeText] = useState(editingTour?.badgeText ?? "");
  const [rating, setRating] = useState(String(editingTour?.rating ?? 5));
  const [reviewCount, setReviewCount] = useState(
    String(editingTour?.reviewCount ?? 12)
  );
  const [visaRequired, setVisaRequired] = useState(
    editingTour?.visaRequired ?? false
  );
  const [visaNote, setVisaNote] = useState(editingTour?.visaNote ?? "");
  const [imageUrl, setImageUrl] = useState(
    resolveImageString(editingTour?.imageUrl)
  );
  const [highlights, setHighlights] = useState<string[]>(
    editingTour?.highlights?.length ? editingTour.highlights : [""]
  );
  const [itinerarySummary, setItinerarySummary] = useState<string[]>(
    editingTour?.itinerarySummary?.length
      ? editingTour.itinerarySummary
      : ["Ngày 1: ", "Ngày 2: "]
  );
  const [includes, setIncludes] = useState<string[]>(
    editingTour?.includes?.length
      ? editingTour.includes
      : ["Vé máy bay / xe du lịch đời mới", "Khách sạn chuẩn 4 sao & ăn sáng buffet"]
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle);
    if (!slugTouched) {
      setSlug(slugifyVietnamese(nextTitle));
    }
  };

  const handleRegionChange = (nextRegion: TourRegion) => {
    setRegion(nextRegion);
    setRegionLabel(REGION_DEFAULTS[nextRegion].label);
    if (nextRegion !== "vietnam" && !isEditing) {
      setVisaRequired(nextRegion !== "southeast-asia");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setErrorMessage(null);
    onSubmittingChange(true);

    const payload: TourFormInput = {
      slug: slug.trim() || slugifyVietnamese(title),
      code: code.trim(),
      title: title.trim(),
      destination: destination.trim(),
      countryOrProvince: countryOrProvince.trim(),
      scope: REGION_DEFAULTS[region].scope,
      region,
      regionLabel: regionLabel.trim() || REGION_DEFAULTS[region].label,
      duration: duration.trim(),
      departureFrom: departureFrom.trim(),
      priceLabel: priceLabel.trim() || "Liên hệ báo giá",
      originalPriceLabel: originalPriceLabel.trim() || undefined,
      rating: Number(rating) || 5,
      reviewCount: Number(reviewCount) || 0,
      badgeText: badgeText.trim() || undefined,
      visaRequired,
      visaNote: visaNote.trim() || undefined,
      imageUrl: imageUrl.trim(),
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      itinerarySummary: itinerarySummary.map((d) => d.trim()).filter(Boolean),
      includes: includes.map((inc) => inc.trim()).filter(Boolean),
    };

    try {
      const endpoint = isEditing
        ? `/api/admin/tours/${encodeURIComponent(editingTour.id)}`
        : "/api/admin/tours";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        tour?: TourPackage;
        error?: string;
      };

      if (!response.ok || !data.tour) {
        setErrorMessage(data.error || "Không thể lưu chương trình tour.");
        return;
      }

      onSaved(data.tour, isEditing ? "update" : "create");
    } catch {
      setErrorMessage("Mất kết nối tới máy chủ khi lưu tour.");
    } finally {
      onSubmittingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div
        className={`space-y-5 transition-opacity ${
          submitting ? "pointer-events-none opacity-65" : ""
        }`}
      >
        <ImageUploadField
          label="Ảnh bìa chương trình tour"
          folder="tours"
          value={imageUrl}
          onChange={setImageUrl}
          previewAlt={title || "Ảnh tour mới"}
        />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="tour-title"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Tên chương trình tour *
          </label>
          <input
            id="tour-title"
            type="text"
            required
            maxLength={180}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ví dụ: Phú Quốc Hoàng Hôn: Cáp Treo Hòn Thơm & Grand World"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm font-medium text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-slug"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Đường dẫn URL (slug) *
          </label>
          <input
            id="tour-slug"
            type="text"
            required
            maxLength={100}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="tour-phu-quoc-hoang-hon"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-code"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Mã tour *
          </label>
          <input
            id="tour-code"
            type="text"
            required
            maxLength={24}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="VN-PQ05"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm font-semibold uppercase text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-destination"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Điểm đến chính *
          </label>
          <input
            id="tour-destination"
            type="text"
            required
            maxLength={80}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Phú Quốc"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-country"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Quốc gia / Tỉnh thành *
          </label>
          <input
            id="tour-country"
            type="text"
            required
            maxLength={80}
            value={countryOrProvince}
            onChange={(e) => setCountryOrProvince(e.target.value)}
            placeholder="Việt Nam • Kiên Giang"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-region"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Khu vực phân loại *
          </label>
          <select
            id="tour-region"
            value={region}
            onChange={(e) => handleRegionChange(e.target.value as TourRegion)}
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm font-medium text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          >
            <option value="vietnam">Trong nước (Việt Nam)</option>
            <option value="southeast-asia">Đông Nam Á (Sing • Mã • Indo)</option>
            <option value="east-asia">Đông Á (Hàn • Nhật)</option>
            <option value="americas-oceania">Mỹ • Úc • Canada</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tour-region-label"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Nhãn khu vực hiển thị
          </label>
          <input
            id="tour-region-label"
            type="text"
            maxLength={60}
            value={regionLabel}
            onChange={(e) => setRegionLabel(e.target.value)}
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-duration"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Thời lượng *
          </label>
          <input
            id="tour-duration"
            type="text"
            required
            maxLength={50}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="3 Ngày 2 Đêm"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-departure"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Điểm khởi hành *
          </label>
          <input
            id="tour-departure"
            type="text"
            required
            maxLength={80}
            value={departureFrom}
            onChange={(e) => setDepartureFrom(e.target.value)}
            placeholder="TP.HCM / Hà Nội"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-price"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Giá hiển thị (SEO / cấu hình)
          </label>
          <input
            id="tour-price"
            type="text"
            maxLength={40}
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            placeholder="5.890.000đ"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-original-price"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Giá niêm yết gốc (tuỳ chọn)
          </label>
          <input
            id="tour-original-price"
            type="text"
            maxLength={40}
            value={originalPriceLabel}
            onChange={(e) => setOriginalPriceLabel(e.target.value)}
            placeholder="6.590.000đ"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="tour-badge"
            className="mb-1 block text-xs font-bold text-[#103F2B]"
          >
            Nhãn nổi bật trên thẻ (tuỳ chọn)
          </label>
          <input
            id="tour-badge"
            type="text"
            maxLength={40}
            value={badgeText}
            onChange={(e) => setBadgeText(e.target.value)}
            placeholder="Best Seller / Khởi hành mỗi tuần"
            className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="tour-rating"
              className="mb-1 block text-xs font-bold text-[#103F2B]"
            >
              Số sao (1–5)
            </label>
            <input
              id="tour-rating"
              type="number"
              min={1}
              max={5}
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="tour-reviews"
              className="mb-1 block text-xs font-bold text-[#103F2B]"
            >
              Lượt đánh giá
            </label>
            <input
              id="tour-reviews"
              type="number"
              min={0}
              max={100000}
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              className="w-full rounded-2xl border border-[#FBCFE2] bg-white px-3.5 py-2.5 text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#FBCFE2] bg-[#FFF5F8]/50 p-3.5 sm:p-4 space-y-2.5">
        <label className="inline-flex items-center gap-2 text-xs font-bold text-[#A51950] cursor-pointer">
          <input
            type="checkbox"
            checked={visaRequired}
            onChange={(e) => setVisaRequired(e.target.checked)}
            className="h-4 w-4 rounded accent-[#E13D7D]"
          />
          <span>Tour yêu cầu thủ tục Visa</span>
        </label>
        <input
          type="text"
          maxLength={180}
          value={visaNote}
          onChange={(e) => setVisaNote(e.target.value)}
          placeholder="Ghi chú thủ tục / Visa (tuỳ chọn, ví dụ: Hỗ trợ hồ sơ Visa Nhật trọn gói)"
          className="w-full rounded-xl border border-[#FBCFE2] bg-white px-3 py-2 text-xs sm:text-sm text-[#103F2B] focus:border-[#E13D7D] focus:outline-none"
        />
      </div>

      <ListFieldEditor
        label="Điểm nhấn nổi bật *"
        items={highlights}
        placeholder="Điểm nhấn trải nghiệm"
        addLabel="Thêm điểm nhấn"
        onChange={setHighlights}
      />

      <ListFieldEditor
        label="Lịch trình tóm tắt theo ngày *"
        items={itinerarySummary}
        placeholder="Ngày X: Lịch trình chi tiết"
        addLabel="Thêm ngày"
        onChange={setItinerarySummary}
      />

      <ListFieldEditor
        label="Dịch vụ bao gồm *"
        items={includes}
        placeholder="Dịch vụ trọn gói"
        addLabel="Thêm dịch vụ"
        onChange={setIncludes}
      />
      </div>

      {submitting && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2.5 rounded-2xl border border-[#B2DFC4] bg-[#EEF9F2] px-4 py-3 text-xs font-semibold text-[#145335]"
        >
          <LuLoader2 className="h-4 w-4 shrink-0 animate-spin text-[#186C42]" />
          <span>
            {isEditing
              ? "Đang lưu cập nhật chương trình tour vào Supabase..."
              : "Đang đăng chương trình tour mới lên Supabase..."}
          </span>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2.5 border-t border-[#FCE7F0] pt-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          className="w-full sm:w-auto"
        >
          {submitting
            ? isEditing
              ? "Đang cập nhật tour..."
              : "Đang thêm tour mới..."
            : isEditing
              ? "Lưu cập nhật tour"
              : "Đăng chương trình tour mới"}
        </Button>
      </div>
    </form>
  );
}

export function TourEditorModal({
  isOpen,
  editingTour,
  onClose,
  onSaved,
}: TourEditorModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      preventClose={submitting}
      title={
        editingTour
          ? `Chỉnh sửa tour: ${editingTour.code}`
          : "Thêm chương trình tour mới"
      }
      maxWidthClass="max-w-3xl"
    >
      {isOpen && (
        <TourEditorForm
          key={editingTour?.id ?? "new-tour"}
          editingTour={editingTour}
          submitting={submitting}
          onSubmittingChange={setSubmitting}
          onClose={handleClose}
          onSaved={onSaved}
        />
      )}
    </Modal>
  );
}
