import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/events";
import { getDepartments } from "@/lib/data/departments";

// Public pages only. /styleguide is deliberately left out (it is also noindex).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [upcoming, past, departments] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    getDepartments(),
  ]);
  const eventUrls = [...upcoming, ...past].map((event) => ({
    url: `${siteConfig.url}/events/${event.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/resources`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/research`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/team`, changeFrequency: "monthly", priority: 0.7 },
    ...departments.map((department) => ({
      url: `${siteConfig.url}/departments/${department.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${siteConfig.url}/events`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/mentors`, changeFrequency: "monthly", priority: 0.6 },
    ...eventUrls,
  ];
}
