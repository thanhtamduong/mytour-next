import type { StaticImageData } from "next/image";

export type ImageSource = string | StaticImageData;

export type TourScope = "domestic" | "international";

export type TourRegion =
  | "vietnam"
  | "southeast-asia"
  | "east-asia"
  | "americas-oceania";

export type TourFilterTab = "all" | "international" | TourRegion;

export type GalleryCategory = "all" | "portrait" | "leading-tour" | "inspection";

export interface StatItem {
  id: string;
  value: string;
  label: string;
  detail: string;
  accent: "pink" | "green";
}

export interface ServicePillar {
  id: string;
  title: string;
  description: string;
  accent: "pink" | "green";
}

export interface AdvisorProfile {
  brandName: string;
  fullName: string;
  nickname: string;
  roleTitle: string;
  tagline: string;
  bioIntro: string;
  bioStory: string;
  philosophyQuote: string;
  avatarUrl: ImageSource;
  heroSecondaryImageUrl: ImageSource;
  lotusAccentImageUrl: ImageSource;
  phone: string;
  zaloLink: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  officeAddress: string;
  workingHours: string;
  featuredDestinations: string[];
  servicePillars: ServicePillar[];
}

export interface PersonalPhotoItem {
  id: string;
  title: string;
  caption: string;
  location: string;
  dateLabel: string;
  category: Exclude<GalleryCategory, "all">;
  categoryLabel: string;
  imageUrl: ImageSource;
  aspect: "portrait" | "landscape" | "square";
}

export interface TourPackage {
  id: string;
  slug: string;
  code: string;
  title: string;
  destination: string;
  countryOrProvince: string;
  scope: TourScope;
  region: TourRegion;
  regionLabel: string;
  duration: string;
  departureFrom: string;
  priceLabel: string;
  originalPriceLabel?: string;
  rating: number;
  reviewCount: number;
  badgeText?: string;
  visaRequired: boolean;
  visaNote?: string;
  imageUrl: ImageSource;
  highlights: string[];
  itinerarySummary: string[];
  includes: string[];
}

export interface JourneyStory {
  id: string;
  customerName: string;
  groupType: string;
  tourTitle: string;
  destination: string;
  dateLabel: string;
  quote: string;
  imageUrl: ImageSource;
  rating: number;
}

export type TourFormInput = Omit<TourPackage, "id">;

export type GalleryFormInput = Omit<PersonalPhotoItem, "id">;

export interface CmsStoreData {
  tours: TourPackage[];
  gallery: PersonalPhotoItem[];
  updatedAt: string;
}
