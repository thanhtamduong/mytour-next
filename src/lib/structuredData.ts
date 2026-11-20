import { JOURNEY_STORIES } from "@/data/journeyData";
import { ADVISOR_PROFILE } from "@/data/profileData";
import { TOUR_PACKAGES } from "@/data/toursData";
import { normalizePhoneE164, sanitizeExternalUrl } from "@/lib/sanitize";
import { SITE_CONFIG, SITE_URL } from "@/lib/siteConfig";
import type { ImageSource, TourPackage } from "@/types/travel";

const JSON_LD_ESCAPE_REGEX = /[<>&\u2028\u2029]/g;
const JSON_LD_ESCAPE_MAP: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

function resolveImageUrl(image: ImageSource): string {
  if (typeof image === "string") return image;
  return `${SITE_URL}${image.src}`;
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    JSON_LD_ESCAPE_REGEX,
    (ch) => JSON_LD_ESCAPE_MAP[ch] ?? ch
  );
}

export function buildHomeJsonLd(tours: TourPackage[] = TOUR_PACKAGES) {
  const normalizedPhone = normalizePhoneE164(ADVISOR_PROFILE.phone);
  const totalReviews = tours.reduce((sum, t) => sum + t.reviewCount, 0);
  const weightedRating =
    tours.reduce((sum, t) => sum + t.rating * t.reviewCount, 0) /
    Math.max(1, totalReviews);

  const sameAs = [
    ADVISOR_PROFILE.facebookUrl,
    ADVISOR_PROFILE.zaloLink,
    ADVISOR_PROFILE.instagramUrl,
  ]
    .map((url) => sanitizeExternalUrl(url))
    .filter((url) => url.length > 0);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_CONFIG.siteName,
        description: SITE_CONFIG.description,
        inLanguage: "vi-VN",
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#advisor`,
        name: ADVISOR_PROFILE.fullName,
        alternateName: [ADVISOR_PROFILE.nickname, "Thuỳ Linh Travel"],
        jobTitle: ADVISOR_PROFILE.roleTitle,
        description: ADVISOR_PROFILE.bioIntro,
        url: SITE_URL,
        image: resolveImageUrl(ADVISOR_PROFILE.avatarUrl),
        telephone: normalizedPhone,
        sameAs,
        worksFor: {
          "@type": "Organization",
          name: ADVISOR_PROFILE.brandName,
        },
        knowsAbout: ADVISOR_PROFILE.featuredDestinations,
      },
      {
        "@type": "TravelAgency",
        "@id": `${SITE_URL}/#travel-agency`,
        name: SITE_CONFIG.siteName,
        description: SITE_CONFIG.description,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        telephone: normalizedPhone,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "242 Trần Hưng Đạo, Cầu Ông Lãnh",
          addressLocality: "Hồ Chí Minh",
          addressCountry: "VN",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "22:00",
          },
        ],
        areaServed: [
          { "@type": "Country", name: "Vietnam" },
          { "@type": "Country", name: "Singapore" },
          { "@type": "Country", name: "Malaysia" },
          { "@type": "Country", name: "Indonesia" },
          { "@type": "Country", name: "South Korea" },
          { "@type": "Country", name: "Japan" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Australia" },
          { "@type": "Country", name: "Canada" },
        ],
        sameAs,
        ...(totalReviews > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(weightedRating.toFixed(1)),
                reviewCount: totalReviews,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
        ...(JOURNEY_STORIES.length > 0
          ? {
              review: JOURNEY_STORIES.map((story) => ({
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: story.customerName,
                },
                reviewBody: story.quote,
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: story.rating,
                  bestRating: 5,
                  worstRating: 1,
                },
              })),
            }
          : {}),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#tours-list`,
        name: "Danh mục tour du lịch trong nước & quốc tế chọn lọc",
        numberOfItems: tours.length,
        itemListElement: tours.map((tour, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/tours/${tour.slug}`,
          item: {
            "@type": "TouristTrip",
            name: tour.title,
            description: tour.highlights.join(". "),
            image: resolveImageUrl(tour.imageUrl),
            url: `${SITE_URL}/tours/${tour.slug}`,
            touristType:
              tour.scope === "domestic"
                ? "Tour du lịch trong nước"
                : "Tour du lịch quốc tế",
            provider: {
              "@id": `${SITE_URL}/#travel-agency`,
            },
          },
        })),
      },
    ],
  };
}

export function buildTourJsonLd(tour: TourPackage) {
  const tourUrl = `${SITE_URL}/tours/${tour.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tour đang bán",
            item: `${SITE_URL}/#tour-du-lich`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tour.destination,
            item: tourUrl,
          },
        ],
      },
      {
        "@type": "TouristTrip",
        name: tour.title,
        description: `${tour.title} (${tour.duration}, khởi hành từ ${tour.departureFrom}). ${tour.highlights.join(". ")}`,
        image: resolveImageUrl(tour.imageUrl),
        url: tourUrl,
        touristType:
          tour.scope === "domestic"
            ? "Gia đình, nhóm bạn, du lịch nội địa"
            : "Gia đình, nhóm bạn, du lịch quốc tế",
        itinerary: {
          "@type": "ItemList",
          numberOfItems: tour.itinerarySummary.length,
          itemListElement: tour.itinerarySummary.map((step, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: step,
          })),
        },
        provider: {
          "@type": "TravelAgency",
          "@id": `${SITE_URL}/#travel-agency`,
          name: SITE_CONFIG.siteName,
          url: SITE_URL,
        },
      },
    ],
  };
}
