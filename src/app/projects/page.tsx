import { ProjectsExplorer } from "@/components/sections/projects/ProjectsExplorer";
import type { CardPerson } from "@/components/sections/projects/ProjectCard";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { getDepartments } from "@/lib/data/departments";
import { getProjects } from "@/lib/data/projects";
import { getMembersByIds } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";
import type { TileColor } from "@/types/content";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Open-source software, student tools and technical prototypes built and maintained by SES members.",
});

const avatarColors: TileColor[] = ["yellow", "mint", "lilac", "coral", "sky"];

export default async function ProjectsPage() {
  const [projects, departments] = await Promise.all([getProjects(), getDepartments()]);
  const members = await getMembersByIds(projects.flatMap((p) => p.contributorIds));

  const departmentNames = Object.fromEntries(departments.map((d) => [d.id, d.name]));
  const peopleByProject: Record<string, CardPerson[]> = Object.fromEntries(
    projects.map((p) => [
      p.id,
      members
        .filter((m) => p.contributorIds.includes(m.id))
        .map((m, i) => ({
          name: m.name,
          src: m.photo?.url,
          color: avatarColors[i % avatarColors.length],
        })),
    ]),
  );

  return (
    <Section labelledBy="projects-title" background="dots">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Tag color="lilac">Shipped code</Tag>
            <Tag color="mint">100% open source</Tag>
          </div>
          <h1 id="projects-title" className="font-display text-h1 font-bold">
            Projects
          </h1>
          <p className="max-w-prose">
            Open-source software, student tools and technical prototypes built and maintained by
            society members.
          </p>
        </header>

        <ProjectsExplorer
          projects={projects}
          departmentNames={departmentNames}
          peopleByProject={peopleByProject}
        />
      </div>
    </Section>
  );
}