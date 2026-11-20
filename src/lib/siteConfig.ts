import { normalizeSiteUrl } from "@/lib/sanitize";

const DEFAULT_SITE_URL = "https://thuylinhtravel.vn";

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  DEFAULT_SITE_URL
);

export const SITE_CONFIG = {
  siteName: "Thuỳ Linh Travel — VIETOURIST",
  defaultTitle:
    "Thuỳ Linh Travel | Chuyên Viên Tư Vấn Tour Du Lịch Trong Nước & Quốc Tế",
  titleTemplate: "%s | Thuỳ Linh Travel — VIETOURIST",
  description:
    "Trang cá nhân Nguyễn Thị Thuỳ Linh (VIETOURIST) — Chuyên viên tư vấn & điều hành tour du lịch Trong nước (Đà Lạt, Nha Trang, Đà Nẵng, Huế) & Quốc tế (Singapore, Malaysia, Indonesia, Hàn Quốc, Nhật Bản, Mỹ, Úc, Canada), hỗ trợ Visa tận tâm.",
  locale: "vi_VN",
  lastModifiedIso: "2026-11-18T00:00:00.000Z",
  keywords: [
    "Thuỳ Linh Travel",
    "Nguyễn Thị Thuỳ Linh",
    "Vietourist",
    "chuyên viên tư vấn tour du lịch",
    "sales tour du lịch",
    "tour du lịch trong nước",
    "tour du lịch quốc tế",
    "tour Đà Lạt",
    "tour Nha Trang",
    "tour Đà Nẵng Hội An",
    "tour Huế",
    "tour Singapore Malaysia",
    "tour Bali Indonesia",
    "tour Hàn Quốc",
    "tour Nhật Bản",
    "tour Mỹ bờ Tây",
    "tour Úc Sydney Melbourne",
    "tour Canada",
    "tư vấn visa Mỹ Úc Canada",
  ],
} as const;
