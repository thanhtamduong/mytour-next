import type { TourPackage } from "@/types/travel";

export const TOUR_PACKAGES: TourPackage[] = [];

export function getTourBySlug(slug: string): TourPackage | undefined {
  return TOUR_PACKAGES.find((tour) => tour.slug === slug);
}

export function getRelatedTours(
  currentTour: TourPackage,
  limit = 3
): TourPackage[] {
  const sameScope = TOUR_PACKAGES.filter(
    (item) => item.id !== currentTour.id && item.scope === currentTour.scope
  );
  const others = TOUR_PACKAGES.filter(
    (item) => item.id !== currentTour.id && item.scope !== currentTour.scope
  );
  return [...sameScope, ...others].slice(0, limit);
}
