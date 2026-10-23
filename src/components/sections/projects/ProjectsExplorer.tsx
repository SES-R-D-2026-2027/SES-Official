"use client";

import { useState } from "react";
import { HandNote } from "@/components/ui/HandNote";
import { Tag } from "@/components/ui/Tag";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Project } from "@/types/content";
import { ProjectCard, statusLabels, type CardPerson } from "./ProjectCard";

type Filter = "all" | Project["projectStatus"];

interface ProjectsExplorerProps {
  projects: Project[];
  departmentNames: Record<string, string>;
  peopleByProject: Record<string, CardPerson[]>;
}

export function ProjectsExplorer({
  projects,
  departmentNames,
  peopleByProject,
}: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");

  // only offer statuses that actually have projects
  const statuses = (Object.keys(statusLabels) as Project["projectStatus"][]).filter((s) =>
    projects.some((p) => p.projectStatus === s),
  );
  const visible = filter === "all" ? projects : projects.filter((p) => p.projectStatus === filter);

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter projects by status" className="flex flex-wrap gap-3">
        {(["all", ...statuses] as Filter[]).map((value) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(value)}
              className={`rounded-brutal-sm px-3 py-1.5 font-mono text-xs font-semibold uppercase border-brutal press focus-ring ${
                active ? "bg-primary text-on-primary" : "bg-surface text-ink"
              }`}
            >
              {value === "all" ? "All" : statusLabels[value]}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-brutal bg-surface p-6 border-brutal">
          No projects match this filter yet.
        </p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.id}>
              <ProjectCard
                project={project}
                departmentName={project.departmentId ? departmentNames[project.departmentId] : undefined}
                people={peopleByProject[project.id] ?? []}
              />
            </li>
          ))}

          {/* "Your project here" tile, from the Stitch design */}
          <li>
            <div className="flex h-full flex-col gap-4 rounded-brutal bg-bg p-5 border-2 border-dashed border-ink">
              <Tag color="yellow" className="self-start">
                Call for proposals
              </Tag>
              <h2 className="font-display text-h3 font-bold">Your project here</h2>
              <p className="text-sm">
                Got an idea? We&apos;ll help you find teammates, mentors and a place to ship it.
              </p>
              <div className="mt-auto flex items-center justify-between gap-3">
                <Link
                  href={siteConfig.cta.href}
                  className="rounded-brutal-sm bg-ink px-4 py-2 text-sm font-semibold text-white press focus-ring"
                >
                  Submit a proposal
                </Link>
                <HandNote tone="ink">we don&apos;t bite!</HandNote>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}