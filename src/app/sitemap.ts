import type { MetadataRoute } from "next";
import { TOUR_PACKAGES } from "@/data/toursData";
import { SITE_CONFIG, SITE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const tourEntries: MetadataRoute.Sitemap = TOUR_PACKAGES.map((tour) => {
    const imageUrl =
      typeof tour.imageUrl === "string"
        ? tour.imageUrl
        : `${SITE_URL}${tour.imageUrl.src}`;

    return {
      url: `${SITE_URL}/tours/${tour.slug}`,
      lastModified: SITE_CONFIG.lastModifiedIso,
      changeFrequency: "weekly",
      priority: 0.85,
      images: [imageUrl],
    };
  });

  return [
    {
      url: SITE_URL,
      lastModified: SITE_CONFIG.lastModifiedIso,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/opengraph-image`],
    },
    ...tourEntries,
  ];
}
