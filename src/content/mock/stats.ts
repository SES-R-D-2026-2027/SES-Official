import type { SiteStats } from "@/types/content";

// TODO(content): illustrative numbers for the homepage tiles (DESIGN.md / see.png).
// Campus Pulse marked equivalent figures as demo stats — replace with real ones.

export const stats: SiteStats = {
  items: [
    {
      value: 6,
      label: "Teams",
      description: "Events, projects, community, tech, design and compete — all student-run.",
      note: "all active!",
      color: "yellow",
    },
    {
      value: 40,
      suffix: "+",
      label: "Events survived",
      description: "Workshops, meetups, game nights and whatever we organize next.",
      color: "mint",
    },
    {
      value: 25,
      label: "Projects shipped",
      description: "Small experiments, side quests and a few that got real.",
      color: "lilac",
    },
    {
      value: 300,
      suffix: "+",
      label: "Students reached",
      description: "Builders, organizers and professional deadline negotiators.",
      note: "join us!",
      color: "coral",
    },
  ],
};
