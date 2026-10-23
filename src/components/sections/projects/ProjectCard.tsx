import { Star } from "lucide-react";
import { AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { formatCompact } from "@/lib/utils";
import type { Project, TileColor } from "@/types/content";

export interface CardPerson {
  name: string;
  src?: string;
  color: TileColor;
}

export const statusLabels: Record<Project["projectStatus"], string> = {
  idea: "Idea",
  "in-progress": "In progress",
  shipped: "Shipped",
  maintained: "Maintained",
};

interface ProjectCardProps {
  project: Project;
  departmentName?: string;
  people: CardPerson[];
}

/** One project card, following the Stitch "Featured projects" card (DESIGN.md §6.6). */
export function ProjectCard({ project, departmentName, people }: ProjectCardProps) {
  const action = project.liveUrl
    ? { href: project.liveUrl, label: "Live demo", sr: " of " }
    : project.docsUrl
      ? { href: project.docsUrl, label: "Docs", sr: " for " }
      : null;

  return (
    <article className="brutal flex h-full flex-col gap-4 bg-tile-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <Tag color={project.color ?? "sky"}>{departmentName ?? "Independent"}</Tag>
        {project.stars !== undefined && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-brutal-sm bg-accent px-2 py-0.5 font-mono text-xs font-semibold border-brutal">
            <Star aria-hidden="true" className="size-3.5" />
            {formatCompact(project.stars)}
            <span className="sr-only"> GitHub stars</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          {statusLabels[project.projectStatus]}
        </p>
        {/* TODO: link the title to /projects/[slug] once the detail page exists */}
        <h2 className="font-display text-h3 font-bold">{project.name}</h2>
      </div>

      <p className="text-sm">{project.tagline}</p>

      <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
        {project.technologies.map((tech) => (
          <li key={tech}>
            <Tag color="paper">{tech}</Tag>
          </li>
        ))}
      </ul>

      {(people.length > 0 || project.lookingForContributors) && (
        <div className="flex items-center justify-between gap-3">
          {people.length > 0 ? <AvatarStack people={people} max={3} /> : <span />}
          {project.lookingForContributors && (
            <span className="font-hand text-lg text-ink">looking for devs!</span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-ink pt-4">
        {project.repoUrl ? (
          <Button href={project.repoUrl} external variant="ghost" size="sm">
            Repo<span className="sr-only"> of {project.name}</span>
          </Button>
        ) : (
          <span className="font-mono text-xs uppercase text-muted">No repo yet</span>
        )}
        {action && (
          <Button href={action.href} external size="sm">
            {action.label}
            <span className="sr-only">
              {action.sr}
              {project.name}
            </span>
          </Button>
        )}
      </div>
    </article>
  );
}