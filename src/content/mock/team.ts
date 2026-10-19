import type { TeamMember } from "@/types/content";
import { base } from "./_base";

// TODO(content): names, photos and roles are intentional placeholders from the Campus Pulse
// preview — no official team details were provided. Replace before launch.

const member = (
  n: number,
  name: string,
  position: string,
  role: TeamMember["role"],
  departmentId?: string,
  extras?: Partial<Pick<TeamMember, "photo" | "funFact" | "bio">>,
): TeamMember => ({
  ...base(`tm-${n}`, `member-${n}`),
  name,
  position,
  role,
  departmentId,
  links: [],
  order: n,
  ...extras,
});

export const team: TeamMember[] = [
  member(1, "Society Lead", "Team profile · add official details", "leadership", "dep-tech", {
    funFact: "Builds things · brings people together",
    bio: "Placeholder bio — TODO.",
  }),
  member(2, "Projects Lead", "Team profile", "leadership", "dep-projects", {
    funFact: "Ideas · prototypes · late commits",
  }),
  member(3, "Events Lead", "Team profile · add official details", "leadership", "dep-events", {
    funFact: "Meetups · workshops · good playlists",
    bio: "Placeholder bio — TODO.",
  }),
  member(4, "Community Lead", "Team profile · add official details", "leadership", "dep-community", {
    funFact: "New faces · big welcomes · snacks",
    bio: "Placeholder bio — TODO.",
  }),
  member(5, "Design Lead", "Member — TODO", "head", "dep-design", {
    funFact: "Stickers first, then the screens",
  }),
  member(6, "Compete Lead", "Member — TODO", "head", "dep-compete", {
    funFact: "Shows up for game night. Wins optional.",
  }),
];
