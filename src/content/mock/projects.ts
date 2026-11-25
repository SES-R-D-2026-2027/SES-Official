import type { Project } from "@/types/content";
import { base } from "./_base";

// Real society projects (content doc, Oct 2026).
// To add a screenshot: put a 16:9 image at public/images/projects/<slug>.jpg and set
// coverImage: { url: "/images/projects/<slug>.jpg", alt: "…", width, height }.

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
