import type { Project } from "@/types/content";
import { base } from "./_base";

// TODO(content): placeholder projects. Names follow the approved mock-up; star counts, links and
// screenshots are not real. Edge cases: no stars, no repo, no cover, idea-stage project.

const screenshot = (alt: string) => ({
  url: "/images/placeholder/screenshot.svg",
  alt,
  width: 800,
  height: 500,
});

export const projects: Project[] = [
  {
    ...base("pr-coursegraph", "coursegraph"),
    name: "CourseGraph",
    tagline:
      "Interactive prerequisite visualizer and degree planner, used by students every semester to chart graduation pathways.",
    description: "Placeholder description — TODO.",
    projectStatus: "maintained",
    technologies: ["TypeScript", "React Flow", "FastAPI"],
    techAreaIds: [],
    contributorIds: ["tm-1", "tm-2", "tm-8", "tm-9", "tm-10"],
    departmentId: "dep-infra",
    repoUrl: "https://github.com/", // TODO(content)
    liveUrl: "https://example.com/coursegraph", // TODO(content)
    stars: 418, // TODO(content)
    coverImage: screenshot("Placeholder screenshot of CourseGraph"),
    gallery: [],
    isFeatured: true,
    lookingForContributors: false,
    color: "sky",
  },
  {
    ...base("pr-vessel", "vessel-kernel"),
    name: "Vessel Kernel",
    tagline: "A clean-slate microkernel written in Rust targeting RISC-V.",
    description: "Placeholder description — TODO.",
    projectStatus: "in-progress",
    technologies: ["Rust", "RISC-V", "QEMU"],
    techAreaIds: [],
    contributorIds: ["tm-4", "tm-5"],
    departmentId: "dep-os",
    repoUrl: "https://github.com/", // TODO(content)
    docsUrl: "https://example.com/vessel-docs", // TODO(content)
    stars: 92, // TODO(content)
    gallery: [],
    isFeatured: true,
    lookingForContributors: false,
    color: "mint",
  },
  {
    ...base("pr-prism", "prism-cli"),
    name: "Prism CLI",
    tagline:
      "Lightweight distributed trace visualization for microservices, right in the terminal.",
    description: "Placeholder description — TODO.",
    projectStatus: "shipped",
    technologies: ["Go", "eBPF", "Bubble Tea"],
    techAreaIds: [],
    contributorIds: ["tm-6", "tm-9"],
    departmentId: "dep-dist",
    repoUrl: "https://github.com/", // TODO(content)
    stars: 276, // TODO(content)
    gallery: [],
    isFeatured: true,
    lookingForContributors: false,
    color: "lilac",
  },
  {
    ...base("pr-lab-booker", "lab-booker"),
    name: "Lab Booker — TODO",
    tagline: "Placeholder: a booking tool for lab machines. Needs a frontend dev and a designer.",
    description: "Placeholder description — TODO.",
    projectStatus: "idea",
    technologies: ["Next.js", "PostgreSQL"],
    techAreaIds: [],
    contributorIds: ["tm-3"],
    // no repo yet, no stars, no cover
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
