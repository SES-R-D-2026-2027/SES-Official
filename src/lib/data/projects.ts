import { projects as mockProjects } from "@/content/mock/projects";
import type { Project } from "@/types/content";
import { fromSource } from "./source";

export async function getProjects(): Promise<Project[]> {
  return fromSource<Project[]>({
    mock: () => mockProjects,
    api: "/api/public/projects",
    tags: ["projects"],
  });
}

export interface ProjectStats {
  repositories: number;
  stars: number;
  contributors: number;
  /** Not idea-stage. */
  active: number;
  technologies: string[];
}

/** Totals for the "GitHub stats" and tech-stack tiles, derived from the project list. */
export function summarizeProjects(projects: Project[]): ProjectStats {
  return {
    repositories: projects.filter((p) => p.repoUrl).length,
    stars: projects.reduce((sum, p) => sum + (p.stars ?? 0), 0),
    contributors: new Set(projects.flatMap((p) => p.contributorIds)).size,
    active: projects.filter((p) => p.projectStatus !== "idea").length,
    technologies: [...new Set(projects.flatMap((p) => p.technologies))],
  };
}
