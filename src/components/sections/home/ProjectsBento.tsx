import { ArrowRight, Code, GitFork, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoTile } from "@/components/bento/BentoTile";
import { CountUp } from "@/components/motion/CountUp";
import { Draggable } from "@/components/motion/Draggable";
import { AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { HandNote } from "@/components/ui/HandNote";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { tileColors } from "@/components/ui/variants";
import { isEnabled } from "@/config/features";
import { siteConfig } from "@/config/site";
import { homeCopy } from "@/content/home";
import type { ProjectStats } from "@/lib/data/projects";
import type { Project, TeamMember, TileColor } from "@/types/content";
import { formatCompact } from "@/lib/utils";

export interface ProjectsBentoProps {
  projects: Project[];
  stats: ProjectStats;
  contributors: TeamMember[];
}

const copy = homeCopy.projects;
const githubUrl = siteConfig.socials.find((s) => s.icon === "github")?.href;
const stickerColors = tileColors.filter((c) => c !== "paper");
const stickerRotations = ["-6", "3", "-3", "6", "0"] as const;

function TechTags({ technologies, max = 3 }: { technologies: string[]; max?: number }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
      {technologies.slice(0, max).map((tech) => (
        <li key={tech}>
          <Tag color="paper">{tech}</Tag>
        </li>
      ))}
    </ul>
  );
}

function Stars({ count }: { count?: number }) {
  if (count === undefined) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-brutal-sm bg-accent px-2 py-0.5 font-mono text-xs font-semibold border-brutal">
      <Star aria-hidden="true" className="size-3.5" />
      {formatCompact(count)}
      <span className="sr-only"> GitHub stars</span>
    </span>
  );
}

function FeaturedProjectTile({ project }: { project: Project }) {
  return (
    <BentoTile
      size="2x2"
      as="li"
      color={project.color ?? "sky"}
      cellClassName="lg:col-start-2 lg:row-start-1"
      sticker={
        project.lookingForContributors ? undefined : (
          <Sticker color="yellow" rotate="3">
            Featured
          </Sticker>
        )
      }
      className="gap-4"
    >
      {project.coverImage && (
        <div className="relative aspect-video overflow-hidden rounded-brutal-sm bg-surface border-brutal">
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 560px, (min-width: 768px) 90vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 font-bold">{project.name}</h3>
        <Stars count={project.stars} />
      </div>
      <p className="text-sm">{project.tagline}</p>
      <TechTags technologies={project.technologies} />
      <div className="mt-auto flex flex-wrap gap-3 pt-2">
        {project.liveUrl && (
          <Button href={project.liveUrl} external size="sm">
            Live demo<span className="sr-only"> of {project.name}</span>
          </Button>
        )}
        {project.repoUrl && (
          <Button href={project.repoUrl} external variant="ghost" size="sm">
            Repo<span className="sr-only"> of {project.name}</span>
          </Button>
        )}
        {project.docsUrl && (
          <Button href={project.docsUrl} external variant="ghost" size="sm">
            Docs<span className="sr-only"> for {project.name}</span>
          </Button>
        )}
      </div>
    </BentoTile>
  );
}

function ProjectTile({ project, cellClassName }: { project: Project; cellClassName: string }) {
  return (
    <BentoTile
      href={`/projects/${project.slug}`}
      as="li"
      color={project.color ?? "paper"}
      cellClassName={cellClassName}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold">{project.name}</h3>
        <Stars count={project.stars} />
      </div>
      <p className="line-clamp-3 text-sm">{project.tagline}</p>
      <div className="mt-auto">
        <TechTags technologies={project.technologies} max={2} />
      </div>
    </BentoTile>
  );
}

/**
 * Featured projects bento (DESIGN.md §6.6). DOM order puts the featured project first for the
 * one-column mobile layout; explicit lg placements recreate the diagram on desktop.
 */
export function ProjectsBento({ projects, stats, contributors }: ProjectsBentoProps) {
  const featured = projects.filter((p) => p.isFeatured);
  const [lead, second, third] = featured.length ? featured : projects;
  const wanted = projects.find((p) => p.lookingForContributors);
  const draggable = isEnabled("draggableStickers");
  const people = contributors.map((member, i) => ({
    name: member.name,
    src: member.photo?.url,
    color: stickerColors[i % stickerColors.length] as TileColor,
  }));

  return (
    <Section labelledBy="projects-title" background="surface" divider>
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="projects-title"
          title={copy.title}
          description={copy.description}
          tags={[
            { label: copy.tags[0], color: "lilac" },
            { label: copy.tags[1], color: "mint" },
          ]}
          action={
            githubUrl && (
              <Button href={githubUrl} external variant="ghost" size="sm">
                Explore all repositories
              </Button>
            )
          }
        />

        <BentoGrid as="ul">
          {lead && <FeaturedProjectTile project={lead} />}

          <BentoTile color="yellow" as="li" cellClassName="lg:col-start-1 lg:row-start-1">
            <Code aria-hidden="true" className="size-7" />
            <h3 className="font-display text-lg font-bold">GitHub stats</h3>
            <dl className="mt-auto grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Stars", value: stats.stars, icon: Star },
                { label: "Repos", value: stats.repositories, icon: GitFork },
                { label: "Devs", value: stats.contributors, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <dt className="order-2 flex items-center gap-1 font-mono text-xs uppercase">
                    <Icon aria-hidden="true" className="size-3" />
                    {label}
                  </dt>
                  <dd className="font-display text-2xl font-bold">
                    <CountUp to={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </BentoTile>

          {second && <ProjectTile project={second} cellClassName="lg:col-start-4 lg:row-start-1" />}

          <BentoTile color="coral" as="li" cellClassName="lg:col-start-1 lg:row-start-2">
            <h3 className="font-display text-lg font-bold">Tech stack</h3>
            <p className="sr-only">Technologies used across our projects:</p>
            <ul className="sr-only">
              {stats.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            {/* draggable decoration; the list above is the accessible version */}
            <div aria-hidden="true" className="relative flex flex-1 flex-wrap content-start gap-2">
              {stats.technologies.slice(0, 8).map((tech, i) => (
                <Draggable key={tech} disabled={!draggable}>
                  <Sticker
                    color={stickerColors[i % stickerColors.length]}
                    rotate={stickerRotations[i % stickerRotations.length]}
                  >
                    {tech}
                  </Sticker>
                </Draggable>
              ))}
            </div>
            {draggable && <HandNote tone="ink">drag us around!</HandNote>}
          </BentoTile>

          {third && <ProjectTile project={third} cellClassName="lg:col-start-4 lg:row-start-2" />}

          <BentoTile
            size="2x1"
            as="li"
            color="mint"
            href={wanted ? `/projects/${wanted.slug}` : siteConfig.cta.href}
            cellClassName="lg:col-start-1 lg:row-start-3"
          >
            <Tag color="paper" className="self-start">
              Your project here
            </Tag>
            <h3 className="font-display text-xl font-bold">
              {wanted ? wanted.name : "Pitch your own project"}
            </h3>
            <p className="text-sm">
              {wanted
                ? wanted.tagline
                : "Got an idea? We'll help you find teammates, mentors and a place to ship it."}
            </p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
              {wanted && <TechTags technologies={wanted.technologies} />}
              <HandNote tone="ink" arrow="right">
                looking for devs!
              </HandNote>
            </div>
          </BentoTile>

          <BentoTile size="2x1" as="li" color="lilac" cellClassName="lg:col-start-3 lg:row-start-3">
            <Tag color="paper" className="self-start">
              Contributors
            </Tag>
            <h3 className="font-display text-xl font-bold">
              {stats.contributors} students shipped code
            </h3>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
              <AvatarStack people={people} max={6} />
              <Link
                href={siteConfig.cta.href}
                className="inline-flex items-center gap-1 rounded-brutal-sm text-sm font-semibold text-ink underline underline-offset-4 focus-ring"
              >
                Be next
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </BentoTile>
        </BentoGrid>
      </div>
    </Section>
  );
}
