import { Hero } from "@/components/sections/home/Hero";
import { JoinCta } from "@/components/sections/home/JoinCta";
import { LabLife } from "@/components/sections/home/LabLife";
import { StatsRow } from "@/components/sections/home/StatsRow";
import { TeamStrip } from "@/components/sections/home/TeamStrip";
import { TechPlayground } from "@/components/sections/home/TechPlayground";
import { VibeMarquee } from "@/components/sections/home/VibeMarquee";
import { homeCopy } from "@/content/home";
import { getDepartments } from "@/lib/data/departments";
import { getSiteStats } from "@/lib/data/stats";
import { getProjects, summarizeProjects } from "@/lib/data/projects";
import { getTeam } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";

// Uses the society's short description from src/config/site.ts.
export const metadata = buildMetadata();

export default async function HomePage() {
  const [departments, projects, stats, team] = await Promise.all([
    getDepartments(),
    getProjects(),
    getSiteStats(),
    getTeam(),
  ]);
  const projectStats = summarizeProjects(projects);
  const officerStatIndex = stats.items.findIndex((item) =>
    /^(people listed|total officers|officers)$/i.test(item.label.trim()),
  );
  const officerIndex = officerStatIndex >= 0 ? officerStatIndex : Math.min(1, stats.items.length - 1);
  const officerStat = {
    value: new Set(team.map((member) => member.id)).size,
    label: "Total officers",
    description: "Every person in the published officer directory counts, regardless of title.",
    color: "mint" as const,
  };
  const homeStats = {
    ...stats,
    items: stats.items.length
      ? stats.items.map((item, index) =>
          index === officerIndex
            ? { ...item, ...officerStat }
            : item,
        )
      : [officerStat],
  };

  return (
    <>
      <Hero
        // only what the client-side map needs crosses the server → client boundary
        departments={departments.map(({ id, slug, name, shortDescription, color }) => ({
          id,
          slug,
          name,
          shortDescription,
          color,
        }))}
        activeProjects={projectStats.active}
      />
      <StatsRow stats={homeStats} />
      <LabLife {...homeCopy.labLife} />
      {/* Events, projects and announcements homepage panels remain intentionally disabled. */}
      <TechPlayground />
      <TeamStrip members={team} />
      <VibeMarquee />
      <JoinCta />
    </>
  );
}
