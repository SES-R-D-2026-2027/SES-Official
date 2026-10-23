import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Public pages only. /styleguide is deliberately left out (it is also noindex).
// TODO(phase 3+): add each route as it is built.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/team`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
