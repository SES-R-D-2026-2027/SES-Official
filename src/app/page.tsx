import { AnnouncementsList } from "@/components/sections/home/AnnouncementsList";
import { EventsBento } from "@/components/sections/home/EventsBento";
import { Hero } from "@/components/sections/home/Hero";
import { JoinCta } from "@/components/sections/home/JoinCta";
import { LabLife } from "@/components/sections/home/LabLife";
import { ProjectsBento } from "@/components/sections/home/ProjectsBento";
import { StatsRow } from "@/components/sections/home/StatsRow";
import { TeamStrip } from "@/components/sections/home/TeamStrip";
import { TechPlayground } from "@/components/sections/home/TechPlayground";
import { VibeMarquee } from "@/components/sections/home/VibeMarquee";
import { homeCopy } from "@/content/home";
import { getLatestAnnouncements } from "@/lib/data/announcements";
import { getDepartments } from "@/lib/data/departments";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/events";
import { getProjects, summarizeProjects } from "@/lib/data/projects";
import { getSiteStats } from "@/lib/data/stats";
import { getMembersByIds, getTeam } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";

// Uses the society's short description from src/config/site.ts.
export const metadata = buildMetadata();

export default async function HomePage() {
  const [departments, projects, upcoming, past, announcements, stats, team] = await Promise.all([
    getDepartments(),
    getProjects(),
    getUpcomingEvents(),
    getPastEvents(),
    getLatestAnnouncements(4),
    getSiteStats(),
    getTeam(),
  ]);
  const projectStats = summarizeProjects(projects);
  const contributors = await getMembersByIds(projects.flatMap((p) => p.contributorIds));

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
      <StatsRow stats={stats} />
      <LabLife {...homeCopy.labLife} />
      {/* <EventsBento upcoming={upcoming} past={past} /> */}
      {/* <ProjectsBento projects={projects} stats={projectStats} contributors={contributors} /> */}
      <TechPlayground />
      <TeamStrip members={team} />
      {/* <AnnouncementsList announcements={announcements} /> */}
      <VibeMarquee />
      <JoinCta />
    </>
  );
}
