import type { MetadataRoute } from "next";
import { getStoredTours } from "@/lib/contentStore";
import { SITE_CONFIG, SITE_URL } from "@/lib/siteConfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await getStoredTours();
  const tourEntries: MetadataRoute.Sitemap = tours.map((tour) => {
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
