import "server-only";

import crypto from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import myAvatarImg from "@/assets/img-my.jpg";
import {
  ADVISOR_AVATAR_SENTINEL,
  isSupabaseConfigured,
} from "@/lib/supabaseConfig";
import { createSupabasePublicClient } from "@/lib/supabasePublic";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type {
  CmsStoreData,
  GalleryFormInput,
  ImageSource,
  PersonalPhotoItem,
  TourFormInput,
  TourPackage,
} from "@/types/travel";

interface TourRow {
  id: string;
  slug: string;
  code: string;
  title: string;
  destination: string;
  country_or_province: string;
  scope: TourPackage["scope"];
  region: TourPackage["region"];
  region_label: string;
  duration: string;
  departure_from: string;
  price_label: string;
  original_price_label: string | null;
  rating: number | string;
  review_count: number;
  badge_text: string | null;
  visa_required: boolean;
  visa_note: string | null;
  image_url: string;
  highlights: unknown;
  itinerary_summary: unknown;
  includes: unknown;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface GalleryRow {
  id: string;
  title: string;
  caption: string;
  location: string;
  date_label: string;
  category: PersonalPhotoItem["category"];
  category_label: string;
  image_url: string;
  aspect: PersonalPhotoItem["aspect"];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item));
}

function resolveStoredImageSource(rawImageUrl: string): ImageSource {
  if (rawImageUrl === ADVISOR_AVATAR_SENTINEL) {
    return myAvatarImg;
  }
  return rawImageUrl;
}

function normalizeImageForStorage(rawImageUrl: ImageSource): string {
  if (typeof rawImageUrl !== "string") {
    return ADVISOR_AVATAR_SENTINEL;
  }
  if (rawImageUrl === myAvatarImg.src) {
    return ADVISOR_AVATAR_SENTINEL;
  }
  return rawImageUrl;
}

function mapTourRowToPackage(row: TourRow): TourPackage {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    title: row.title,
    destination: row.destination,
    countryOrProvince: row.country_or_province,
    scope: row.scope,
    region: row.region,
    regionLabel: row.region_label,
    duration: row.duration,
    departureFrom: row.departure_from,
    priceLabel: row.price_label,
    originalPriceLabel: row.original_price_label ?? undefined,
    rating: Number(row.rating) || 5,
    reviewCount: Number(row.review_count) || 0,
    badgeText: row.badge_text ?? undefined,
    visaRequired: Boolean(row.visa_required),
    visaNote: row.visa_note ?? undefined,
    imageUrl: resolveStoredImageSource(row.image_url),
    highlights: toStringArray(row.highlights),
    itinerarySummary: toStringArray(row.itinerary_summary),
    includes: toStringArray(row.includes),
  };
}

function mapGalleryRowToItem(row: GalleryRow): PersonalPhotoItem {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    location: row.location,
    dateLabel: row.date_label,
    category: row.category,
    categoryLabel: row.category_label,
    imageUrl: resolveStoredImageSource(row.image_url),
    aspect: row.aspect,
  };
}

function mapTourInputToRow(input: TourFormInput, slugOverride?: string) {
  return {
    slug: slugOverride ?? input.slug,
    code: input.code,
    title: input.title,
    destination: input.destination,
    country_or_province: input.countryOrProvince,
    scope: input.scope,
    region: input.region,
    region_label: input.regionLabel,
    duration: input.duration,
    departure_from: input.departureFrom,
    price_label: input.priceLabel,
    original_price_label: input.originalPriceLabel ?? null,
    rating: input.rating,
    review_count: input.reviewCount,
    badge_text: input.badgeText ?? null,
    visa_required: input.visaRequired,
    visa_note: input.visaNote ?? null,
    image_url: normalizeImageForStorage(input.imageUrl),
    highlights: input.highlights,
    itinerary_summary: input.itinerarySummary,
    includes: input.includes,
  };
}

function mapGalleryInputToRow(input: GalleryFormInput) {
  return {
    title: input.title,
    caption: input.caption,
    location: input.location,
    date_label: input.dateLabel,
    category: input.category,
    category_label: input.categoryLabel,
    image_url: normalizeImageForStorage(input.imageUrl),
    aspect: input.aspect,
  };
}

/**
 * Đọc danh sách tour cho các trang public với Next.js Cache Components ("use cache").
 */
export async function getStoredTours(): Promise<TourPackage[]> {
  "use cache";
  cacheTag("tours");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as TourRow[]).map(mapTourRowToPackage);
}

export async function getStoredTourBySlug(
  slug: string
): Promise<TourPackage | undefined> {
  const tours = await getStoredTours();
  return tours.find((tour) => tour.slug === slug);
}

export async function getStoredRelatedTours(
  currentTour: TourPackage,
  limit = 3
): Promise<TourPackage[]> {
  const tours = await getStoredTours();
  const sameScope = tours.filter(
    (item) => item.id !== currentTour.id && item.scope === currentTour.scope
  );
  const others = tours.filter(
    (item) => item.id !== currentTour.id && item.scope !== currentTour.scope
  );
  return [...sameScope, ...others].slice(0, limit);
}

/**
 * Đọc album ảnh cá nhân cho trang public với Next.js Cache Components.
 */
export async function getStoredGallery(): Promise<PersonalPhotoItem[]> {
  "use cache";
  cacheTag("gallery");
  cacheLife("hours");

  const supabase = createSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as GalleryRow[]).map(mapGalleryRowToItem);
}

/**
 * Đọc trực tiếp từ Supabase PostgreSQL cho Admin Dashboard (không qua cache).
 */
export async function getAdminStoreSnapshot(): Promise<CmsStoreData> {
  if (!isSupabaseConfigured()) {
    return {
      tours: [],
      gallery: [],
      updatedAt: new Date().toISOString(),
    };
  }

  const supabase = await createSupabaseServerClient();
  const [toursRes, galleryRes] = await Promise.all([
    supabase
      .from("tours")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  if (toursRes.error) {
    throw new Error(`Không thể tải bảng tours: ${toursRes.error.message}`);
  }
  if (galleryRes.error) {
    throw new Error(
      `Không thể tải bảng gallery_items: ${galleryRes.error.message}`
    );
  }

  return {
    tours: ((toursRes.data ?? []) as TourRow[]).map(mapTourRowToPackage),
    gallery: ((galleryRes.data ?? []) as GalleryRow[]).map(mapGalleryRowToItem),
    updatedAt: new Date().toISOString(),
  };
}

export async function createTourInStore(
  input: TourFormInput
): Promise<TourPackage> {
  const supabase = await createSupabaseServerClient();

  const { data: existingSlug } = await supabase
    .from("tours")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  const finalSlug = existingSlug
    ? `${input.slug}-${crypto.randomUUID().slice(0, 6)}`
    : input.slug;

  const { data, error } = await supabase
    .from("tours")
    .insert({
      ...mapTourInputToRow(input, finalSlug),
      sort_order: 0,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Không thể thêm tour mới vào database.");
  }

  return mapTourRowToPackage(data as TourRow);
}

export async function updateTourInStore(
  id: string,
  input: TourFormInput
): Promise<TourPackage | null> {
  const supabase = await createSupabaseServerClient();

  const { data: existingSlug } = await supabase
    .from("tours")
    .select("id")
    .eq("slug", input.slug)
    .neq("id", id)
    .maybeSingle();

  const finalSlug = existingSlug ? `${input.slug}-${id.slice(-4)}` : input.slug;

  const { data, error } = await supabase
    .from("tours")
    .update(mapTourInputToRow(input, finalSlug))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapTourRowToPackage(data as TourRow) : null;
}

export async function deleteTourInStore(id: string): Promise<TourPackage | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tours")
    .delete()
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapTourRowToPackage(data as TourRow) : null;
}

export async function createGalleryItemInStore(
  input: GalleryFormInput
): Promise<PersonalPhotoItem> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .insert({
      ...mapGalleryInputToRow(input),
      sort_order: 0,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Không thể thêm ảnh mới vào database.");
  }

  return mapGalleryRowToItem(data as GalleryRow);
}

export async function updateGalleryItemInStore(
  id: string,
  input: GalleryFormInput
): Promise<PersonalPhotoItem | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .update(mapGalleryInputToRow(input))
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapGalleryRowToItem(data as GalleryRow) : null;
}

export async function deleteGalleryItemInStore(
  id: string
): Promise<PersonalPhotoItem | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("gallery_items")
    .delete()
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapGalleryRowToItem(data as GalleryRow) : null;
}
