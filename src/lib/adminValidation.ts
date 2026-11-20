import { sanitizeExternalUrl } from "@/lib/sanitize";
import {
  ADVISOR_AVATAR_SENTINEL,
  SUPABASE_STORAGE_BUCKET,
  getSupabaseOrigin,
} from "@/lib/supabaseConfig";
import type {
  GalleryCategory,
  GalleryFormInput,
  PersonalPhotoItem,
  TourFormInput,
  TourRegion,
  TourScope,
} from "@/types/travel";

const VALID_REGIONS: readonly TourRegion[] = [
  "vietnam",
  "southeast-asia",
  "east-asia",
  "americas-oceania",
];

const VALID_GALLERY_CATEGORIES: readonly Exclude<GalleryCategory, "all">[] = [
  "portrait",
  "leading-tour",
  "inspection",
];

const VALID_ASPECTS: readonly PersonalPhotoItem["aspect"][] = [
  "portrait",
  "landscape",
  "square",
];

export const REGION_DEFAULTS: Record<
  TourRegion,
  { scope: TourScope; label: string }
> = {
  vietnam: { scope: "domestic", label: "Trong nước • Việt Nam" },
  "southeast-asia": { scope: "international", label: "Quốc tế • Đông Nam Á" },
  "east-asia": { scope: "international", label: "Quốc tế • Đông Á" },
  "americas-oceania": {
    scope: "international",
    label: "Quốc tế • Mỹ – Úc – Canada",
  },
};

export const GALLERY_CATEGORY_LABELS: Record<
  Exclude<GalleryCategory, "all">,
  string
> = {
  portrait: "Ảnh cá nhân",
  "leading-tour": "Dẫn đoàn & Đón khách",
  inspection: "Khảo sát điểm đến",
};

const SAFE_UPLOAD_PATH_REGEX =
  /^\/uploads\/(tours|gallery)\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/;
const SAFE_STATIC_MEDIA_REGEX = /^\/_next\/static\/media\/[a-zA-Z0-9._-]+$/;
const SAFE_SUPABASE_OBJECT_PATH_REGEX = new RegExp(
  `^/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/(tours|gallery)/[a-zA-Z0-9._-]+\\.(jpg|jpeg|png|webp)$`
);

export function slugifyVietnamese(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function isValidImageUrlString(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;

  if (
    trimmed === ADVISOR_AVATAR_SENTINEL ||
    SAFE_UPLOAD_PATH_REGEX.test(trimmed) ||
    SAFE_STATIC_MEDIA_REGEX.test(trimmed)
  ) {
    return true;
  }

  const safeExternal = sanitizeExternalUrl(trimmed);
  if (!safeExternal) return false;

  try {
    const parsed = new URL(safeExternal);
    if (
      parsed.protocol === "https:" &&
      parsed.hostname === "images.unsplash.com" &&
      parsed.pathname.startsWith("/photo-")
    ) {
      return true;
    }

    const configuredSupabaseOrigin = getSupabaseOrigin();
    const matchesSupabaseHost = configuredSupabaseOrigin
      ? parsed.origin === configuredSupabaseOrigin
      : parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");

    return (
      matchesSupabaseHost &&
      SAFE_SUPABASE_OBJECT_PATH_REGEX.test(parsed.pathname) &&
      !parsed.pathname.includes("..")
    );
  } catch {
    return false;
  }
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

function cleanStringList(
  value: unknown,
  maxItems: number,
  maxItemLen: number
): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanText(item, maxItemLen))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export function validateTourPayload(
  raw: unknown
): { ok: true; data: TourFormInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Dữ liệu tour không hợp lệ." };
  }

  const record = raw as Record<string, unknown>;
  const title = cleanText(record.title, 180);
  if (title.length < 5) {
    return { ok: false, error: "Tên tour cần ít nhất 5 ký tự." };
  }

  const rawSlug = cleanText(record.slug, 100);
  const slug = slugifyVietnamese(rawSlug || title);
  if (slug.length < 3) {
    return { ok: false, error: "Đường dẫn (slug) tour không hợp lệ." };
  }

  const code = cleanText(record.code, 24).toUpperCase();
  if (code.length < 2) {
    return { ok: false, error: "Mã tour cần ít nhất 2 ký tự." };
  }

  const destination = cleanText(record.destination, 80);
  if (!destination) {
    return { ok: false, error: "Vui lòng nhập điểm đến." };
  }

  const countryOrProvince = cleanText(record.countryOrProvince, 80);
  if (!countryOrProvince) {
    return { ok: false, error: "Vui lòng nhập quốc gia / tỉnh thành." };
  }

  const region = VALID_REGIONS.includes(record.region as TourRegion)
    ? (record.region as TourRegion)
    : null;
  if (!region) {
    return { ok: false, error: "Khu vực tour không hợp lệ." };
  }

  const regionDefaults = REGION_DEFAULTS[region];
  const scope: TourScope = regionDefaults.scope;
  const regionLabel =
    cleanText(record.regionLabel, 60) || regionDefaults.label;

  const duration = cleanText(record.duration, 50);
  if (!duration) {
    return { ok: false, error: "Vui lòng nhập thời lượng tour." };
  }

  const departureFrom = cleanText(record.departureFrom, 80);
  if (!departureFrom) {
    return { ok: false, error: "Vui lòng nhập điểm khởi hành." };
  }

  const priceLabel = cleanText(record.priceLabel, 40) || "Liên hệ báo giá";
  const originalPriceLabel =
    cleanText(record.originalPriceLabel, 40) || undefined;
  const badgeText = cleanText(record.badgeText, 40) || undefined;

  const parsedRating = Number(record.rating);
  const rating = Number.isFinite(parsedRating)
    ? Math.min(5, Math.max(1, Math.round(parsedRating * 10) / 10))
    : 5;

  const parsedReviews = Number(record.reviewCount);
  const reviewCount = Number.isFinite(parsedReviews)
    ? Math.min(100000, Math.max(0, Math.round(parsedReviews)))
    : 0;

  const visaRequired = Boolean(record.visaRequired);
  const visaNote = cleanText(record.visaNote, 180) || undefined;

  const imageUrl = cleanText(record.imageUrl, 500);
  if (!isValidImageUrlString(imageUrl)) {
    return {
      ok: false,
      error:
        "Ảnh tour phải được tải lên Supabase Storage hoặc dùng link ảnh hợp lệ từ Unsplash (https://images.unsplash.com/photo-...).",
    };
  }

  const highlights = cleanStringList(record.highlights, 12, 240);
  if (highlights.length === 0) {
    return { ok: false, error: "Cần ít nhất 1 điểm nhấn nổi bật của tour." };
  }

  const itinerarySummary = cleanStringList(record.itinerarySummary, 20, 320);
  if (itinerarySummary.length === 0) {
    return { ok: false, error: "Cần ít nhất 1 mục lịch trình theo ngày." };
  }

  const includes = cleanStringList(record.includes, 15, 240);
  if (includes.length === 0) {
    return { ok: false, error: "Cần ít nhất 1 mục dịch vụ bao gồm." };
  }

  return {
    ok: true,
    data: {
      slug,
      code,
      title,
      destination,
      countryOrProvince,
      scope,
      region,
      regionLabel,
      duration,
      departureFrom,
      priceLabel,
      originalPriceLabel,
      rating,
      reviewCount,
      badgeText,
      visaRequired,
      visaNote,
      imageUrl,
      highlights,
      itinerarySummary,
      includes,
    },
  };
}

export function validateGalleryPayload(
  raw: unknown
): { ok: true; data: GalleryFormInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Dữ liệu hình ảnh không hợp lệ." };
  }

  const record = raw as Record<string, unknown>;
  const title = cleanText(record.title, 140);
  if (title.length < 3) {
    return { ok: false, error: "Tiêu đề ảnh cần ít nhất 3 ký tự." };
  }

  const caption = cleanText(record.caption, 360);
  if (caption.length < 5) {
    return { ok: false, error: "Mô tả ngắn cần ít nhất 5 ký tự." };
  }

  const location = cleanText(record.location, 100);
  if (!location) {
    return { ok: false, error: "Vui lòng nhập địa điểm chụp ảnh." };
  }

  const dateLabel = cleanText(record.dateLabel, 50) || "Khoảnh khắc thực tế";

  const category = VALID_GALLERY_CATEGORIES.includes(
    record.category as Exclude<GalleryCategory, "all">
  )
    ? (record.category as Exclude<GalleryCategory, "all">)
    : null;
  if (!category) {
    return { ok: false, error: "Phân loại ảnh không hợp lệ." };
  }

  const aspect = VALID_ASPECTS.includes(
    record.aspect as PersonalPhotoItem["aspect"]
  )
    ? (record.aspect as PersonalPhotoItem["aspect"])
    : "landscape";

  const imageUrl = cleanText(record.imageUrl, 500);
  if (!isValidImageUrlString(imageUrl)) {
    return {
      ok: false,
      error:
        "Ảnh album phải được tải lên Supabase Storage hoặc dùng link ảnh hợp lệ từ Unsplash.",
    };
  }

  return {
    ok: true,
    data: {
      title,
      caption,
      location,
      dateLabel,
      category,
      categoryLabel: GALLERY_CATEGORY_LABELS[category],
      imageUrl,
      aspect,
    },
  };
}
