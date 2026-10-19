import type { Department } from "@/types/content";
import { base } from "./_base";

// TODO(content): replace with the society's real teams, descriptions and heads.
// Names follow the Campus Pulse preview (events, projects, community, tech).

export const departments: Department[] = [
  {
    ...base("dep-events", "events"),
    name: "Events",
    shortDescription: "Meetups, workshops, game nights and the playlist that keeps the room going.",
    description: "Organizes workshops, hackathons, guest speaker sessions, and social game nights.",
    responsibilities: ["Event planning & logistics", "Speaker outreach", "Community sessions"],
    memberIds: ["tm-3"],
    color: "yellow",
    order: 1,
  },
  {
    ...base("dep-projects", "projects"),
    name: "Projects",
    shortDescription: "Ideas, prototypes, late commits and always room for one more teammate.",
    description: "Drives internal software initiatives, open-source repositories, and developer team formation.",
    responsibilities: ["Mentoring project teams", "Code reviews", "Open-source maintenance"],
    memberIds: ["tm-2"],
    color: "mint",
    order: 2,
  },
  {
    ...base("dep-community", "community"),
    name: "Community",
    shortDescription: "New faces, big welcomes, snacks and the people who make SES feel like home.",
    description: "Welcomes new members, facilitates student collaboration, and manages community outreach.",
    responsibilities: ["Member onboarding", "Discord community", "Social events"],
    memberIds: ["tm-4"],
    color: "coral",
    order: 3,
  },
  {
    ...base("dep-tech", "tech"),
    name: "Tech",
    shortDescription: "Workshops, first commits and a playground from hello-world to “wait, it runs.”",
    description: "Curates technical curriculum, conducts code labs, and provides infrastructure support.",
    responsibilities: ["Technical workshops", "DevOps & infrastructure", "Code competitions"],
    memberIds: ["tm-1"],
    color: "sky",
    order: 4,
  },
  {
    ...base("dep-design", "design"),
    name: "Design",
    shortDescription: "Figma files, stickers, and making the button yellow on purpose.",
    description: "Crafts society visual identity, branding, user interface designs, and event posters.",
    responsibilities: ["UI/UX design", "Brand identity", "Event graphics"],
    memberIds: ["tm-5"],
    color: "lilac",
    order: 5,
  },
  {
    ...base("dep-compete", "competitions"),
    name: "Compete",
    shortDescription: "Hackathons, build weekends, trivia and the occasional game-night rivalry.",
    description: "Prepares competitive programming teams, coordinates hackathon entries, and runs contests.",
    responsibilities: ["Competitive programming", "Hackathon teams", "Problem setting"],
    memberIds: ["tm-6"],
    color: "blue",
    order: 6,
  },
];
