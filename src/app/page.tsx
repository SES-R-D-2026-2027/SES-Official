import { AnnouncementsList } from "@/components/sections/home/AnnouncementsList";
import { EventsBento } from "@/components/sections/home/EventsBento";
import { Hero } from "@/components/sections/home/Hero";
import { JoinCta } from "@/components/sections/home/JoinCta";
import { LabLife } from "@/components/sections/home/LabLife";
import { ProjectsBento } from "@/components/sections/home/ProjectsBento";
import { StatsRow } from "@/components/sections/home/StatsRow";
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
    "SES is the student-run Software Engineering Society at FAST-NUCES. Join workshops, hackathons and open-source projects built by students.",
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
  const hackathon = upcoming.find((e) => e.category === "hackathon" && e.registrationUrl);

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
        hackathon={hackathon}
      />
      <StatsRow stats={stats} />
      <LabLife {...homeCopy.labLife} />
      <EventsBento upcoming={upcoming} past={past} />
      <ProjectsBento projects={projects} stats={projectStats} contributors={contributors} />
      <AnnouncementsList announcements={announcements} />
      <JoinCta />
    </>
  );
}
