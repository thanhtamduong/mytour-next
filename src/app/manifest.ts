import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.defaultTitle,
    short_name: "Thuỳ Linh Travel",
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDFC",
    theme_color: "#E13D7D",
    lang: "vi",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
