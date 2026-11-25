import type { SiteStats } from "@/types/content";

// Snapshot derived from the current local content records (2026-11-25).
// Update these values when the underlying directory/project records change.
export const stats: SiteStats = {
  items: [
    {
      value: 9,
      label: "Functional teams",
      description: "Nine teams support society planning, delivery and communication.",
      color: "yellow",
    },
    {
      value: 17,
      label: "People listed",
      description: "Published leadership, advisor, lead and co-lead records; not total membership.",
      color: "mint",
    },
    {
      value: 1,
      label: "Listed project",
      description: "The current public project catalogue contains one project.",
      color: "lilac",
    },
    {
      value: 0,
      label: "Completed projects",
      description: "No project is currently marked shipped or maintained.",
      color: "coral",
    },
  ],
};
