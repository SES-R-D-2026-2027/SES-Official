import type { SiteStats } from "@/types/content";

// TODO(content): placeholder numbers from the approved mock-up. Replace with real figures
// (admin-editable via ses-api later).

export const stats: SiteStats = {
  items: [
    {
      value: 9,
      label: "Departments",
      description: "From development and media to events, finance and logistics.",
      note: "all active!",
      color: "yellow",
    },
    {
      value: 40,
      suffix: "+",
      label: "Events every year",
      description: "Workshops, keynote talks, demos and hackathons on campus.",
      color: "mint",
    },
    {
      value: 25,
      label: "Active projects",
      description: "Production tools, campus-wide apps and peer-reviewed prototypes.",
      color: "lilac",
    },
    {
      value: 300,
      suffix: "+",
      label: "Active members",
      description: "Undergrads, graduate mentors and alumni across the globe.",
      note: "join us!",
      color: "coral",
    },
  ],
};
