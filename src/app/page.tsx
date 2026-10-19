import { AnnouncementsList } from "@/components/sections/home/AnnouncementsList";
import { EventsBento } from "@/components/sections/home/EventsBento";
import { Hero } from "@/components/sections/home/Hero";
import { JoinCta } from "@/components/sections/home/JoinCta";
import { LabLife } from "@/components/sections/home/LabLife";
import { ProjectsBento } from "@/components/sections/home/ProjectsBento";
import { StatsRow } from "@/components/sections/home/StatsRow";
import { TechPlayground } from "@/components/sections/home/TechPlayground";
import { VibeMarquee } from "@/components/sections/home/VibeMarquee";
import { homeCopy } from "@/content/home";
import { getLatestAnnouncements } from "@/lib/data/announcements";
import { getDepartments } from "@/lib/data/departments";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/events";
import { getProjects, summarizeProjects } from "@/lib/data/projects";
import { getSiteStats } from "@/lib/data/stats";
import { getMembersByIds } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  description:
    "SES is where FAST-NUCES students come together to build projects, learn new tech, make events happen and occasionally debate tabs vs. spaces.",
});

export default async function HomePage() {
  const [departments, projects, upcoming, past, announcements, stats] = await Promise.all([
    getDepartments(),
    getProjects(),
    getUpcomingEvents(),
    getPastEvents(),
    getLatestAnnouncements(4),
    getSiteStats(),
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
      {/* <AnnouncementsList announcements={announcements} /> */}
      <VibeMarquee />
      <JoinCta />
    </>
  );
}
