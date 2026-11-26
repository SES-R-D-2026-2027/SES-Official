import type { Project } from "@/types/content";
import { base } from "./_base";

// Real society projects (content doc, Oct 2026).
// Project media is stored in R2. New files should be uploaded through the approved admin upload flow.

export const projects: Project[] = [
  {
    ...base("pr-ses-website", "ses-official-website"),
    name: "SES Official Website",
    tagline: "Event updates, society information and a place to explore everything SES runs.",
    description:
      "The official SES website provides event updates, society information, and a platform for students to explore events and register for activities and competitions.",
    projectStatus: "in-progress",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    techAreaIds: [],
    // Built by the SES Research & Development Team. TODO(content): list individual contributors once confirmed.
    contributorIds: [],
    departmentId: "dep-dev",
    repoUrl: "https://github.com/SES-R-D-2026-2027/SES-Official",
    // TODO(content): screenshot not provided yet.
    gallery: [],
    isFeatured: true,
    lookingForContributors: false,
    color: "sky",
  },
];
