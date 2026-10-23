import { JoinCta } from "@/components/sections/home/JoinCta";
import { DepartmentTeams } from "@/components/sections/team/DepartmentTeams";
import { OfficersGrid } from "@/components/sections/team/OfficersGrid";
import { TeamHero } from "@/components/sections/team/TeamHero";
import { TeamStats } from "@/components/sections/team/TeamStats";
import { getTeamOverview } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Team",
  description:
    "Meet the officers, department leads and co-leads who run the Software Engineering Society at FAST-NUCES this term.",
  path: "/team",
});

const term = "2026–27 term";

export default async function TeamPage() {
  const { officers, departments } = await getTeamOverview();
  const leads = departments.reduce((sum, { members }) => sum + members.length, 0);

  return (
    <>
      <TeamHero
        term={term}
        officers={officers}
        departments={departments.map(({ department }) => department)}
      />
      <TeamStats
        items={[
          { value: officers.length, label: "Officers", color: "yellow" },
          { value: departments.length, label: "Departments", color: "mint" },
          { value: leads, label: "Leads & co-leads", color: "lilac" },
          { value: 100, suffix: "%", label: "Student-run", color: "coral", note: "always!" },
        ]}
      />
      <OfficersGrid officers={officers} />
      <DepartmentTeams departments={departments} />
      <JoinCta />
    </>
  );
}
