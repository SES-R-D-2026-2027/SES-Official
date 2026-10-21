import type { Project } from "@/types/content";
import { base } from "./_base";

// TODO(content): Campus Pulse demo concepts — not confirmed society projects.
// Star counts, links and screenshots are placeholders.

const screenshot = (alt: string) => ({
  url: "/images/placeholder/screenshot.svg",
  alt,
  width: 800,
  height: 500,
});

export const projects: Project[] = [
  {
    ...base("pr-campusconnect", "campusconnect"),
    name: "CampusConnect",
    tagline:
      "A platform for making campus communities easier to find. Pitch an idea, find a team, get moving.",
    description:
      "An open-source campus community hub that connects students across departments for projects, study groups, and campus events.",
    projectStatus: "in-progress",
    technologies: ["Next.js", "TypeScript", "Node.js"],
    techAreaIds: [],
    contributorIds: ["tm-1", "tm-2", "tm-5"],
    departmentId: "dep-projects",
    repoUrl: "https://github.com/",
    liveUrl: "https://example.com/campusconnect",
    stars: 12,
    coverImage: screenshot("CampusConnect platform interface"),
    gallery: [],
    isFeatured: true,
    lookingForContributors: false,
    color: "sky",
  },
  {
    ...base("pr-study-buddy", "study-buddy"),
    name: "Study Buddy",
    tagline: "A playful app for finding study partners who are also on their third coffee.",
    description:
      "A peer-matching utility designed to help students discover study groups and collaborate on coursework.",
    projectStatus: "in-progress",
    technologies: ["React", "Python"],
    techAreaIds: [],
    contributorIds: ["tm-2", "tm-4"],
    departmentId: "dep-projects",
    repoUrl: "https://github.com/",
    stars: 4,
    gallery: [],
    isFeatured: true,
    lookingForContributors: false,
    color: "mint",
  },
  {
    ...base("pr-campus-quest", "campus-quest"),
    name: "Campus Quest",
    tagline: "An interactive scavenger hunt making campus orientation week even more fun.",
    description:
      "A location-based mobile adventure to explore campus landmarks, solve riddles, and unlock engineering challenges.",
    projectStatus: "idea",
    technologies: ["Flutter", "Maps"],
    techAreaIds: [],
    contributorIds: ["tm-3"],
    departmentId: "dep-community",
    gallery: [],
    isFeatured: true,
    lookingForContributors: true,
    color: "lilac",
  },
  {
    ...base("pr-your-idea", "your-idea-here"),
    name: "Your idea here",
    tagline: "Got a project idea? Bring it to the table. We'll help you find a team.",
    description:
      "Pitch a concept to the society. We connect student creators with developer teammates and mentorship to ship.",
    projectStatus: "idea",
    technologies: ["Figma", "Next.js"],
    techAreaIds: [],
    contributorIds: ["tm-1"],
    gallery: [],
    isFeatured: false,
    lookingForContributors: true,
    color: "yellow",
  },
    {
    ...base("pr-campus-bot", "campus-bot"),
    name: "Campus Bot — TODO",
    tagline: "Placeholder: a chatbot that answers common campus questions.",
    description: "Placeholder description — TODO.",
    projectStatus: "in-progress",
    technologies: ["Python", "FastAPI", "Discord"],
    techAreaIds: [],
    contributorIds: ["tm-2", "tm-6"],
    departmentId: "dep-infra",
    repoUrl: "https://github.com/", // TODO(content)
    stars: 34, // TODO(content)
    gallery: [],
    isFeatured: false,
    lookingForContributors: true,
    color: "coral",
  },
  {
    ...base("pr-notes-hub", "notes-hub"),
    name: "Notes Hub — TODO",
    tagline: "Placeholder: a shared place for course notes and past papers.",
    description: "Placeholder description — TODO.",
    projectStatus: "shipped",
    technologies: ["Next.js", "MongoDB"],
    techAreaIds: [],
    contributorIds: ["tm-1", "tm-8"],
    liveUrl: "https://example.com/notes-hub", // TODO(content)
    repoUrl: "https://github.com/", // TODO(content)
    stars: 128, // TODO(content)
    gallery: [],
    isFeatured: false,
    lookingForContributors: false,
    color: "mint",
  },
  {
    ...base("pr-trace-lab", "trace-lab"),
    name: "Trace Lab — TODO",
    tagline: "Placeholder: experiments with tracing and observability.",
    description: "Placeholder description — TODO.",
    projectStatus: "maintained",
    technologies: ["Go", "OpenTelemetry"],
    techAreaIds: [],
    contributorIds: ["tm-9"],
    departmentId: "dep-dist",
    docsUrl: "https://example.com/trace-lab", // TODO(content)
    stars: 61, // TODO(content)
    gallery: [],
    isFeatured: false,
    lookingForContributors: false,
    color: "lilac",
  },
];
