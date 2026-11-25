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
      label: "Total officers",
      description: "Every person in the published officer directory counts, regardless of title.",
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
