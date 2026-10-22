import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { DepartmentWithTeam } from "@/lib/data/team";

export interface DepartmentTeamsProps {
  departments: DepartmentWithTeam[];
}

/**
 * One card per department with its lead and co-lead. Each card carries the department slug as
 * its id, so the hero's department chips can jump straight to it.
 */
export function DepartmentTeams({ departments }: DepartmentTeamsProps) {
  if (departments.length === 0) return null;
  return (
    <Section labelledBy="departments-title" background="surface" divider>
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="departments-title"
          title="Departments"
          description="Every department has a lead, and some have a co-lead too. Find the people to talk to about anything SES."
          tags={[{ label: `${departments.length} departments`, color: "mint" }]}
          note="we don't bite!"
        />
        <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map(({ department, members }) => (
            <StaggerItem as="li" key={department.id} className="flex">
              <Card
                as="article"
                id={department.slug}
                aria-labelledby={`${department.slug}-title`}
                color={department.color}
                className="flex w-full scroll-mt-24 flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <h3 id={`${department.slug}-title`} className="font-display text-xl font-bold">
                    {department.name}
                  </h3>
                  <p className="text-sm">{department.shortDescription}</p>
                </div>
                <ul className="flex flex-col gap-3">
                  {members.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center gap-3 rounded-brutal bg-surface p-2.5 border-brutal"
                    >
                      <Avatar
                        name={member.name}
                        src={member.photo?.url}
                        alt={member.photo?.alt}
                        fallback="silhouette"
                        color={department.color}
                        size="lg"
                      />
                      <div className="flex flex-col">
                        <span className="font-display text-lg leading-tight font-bold">
                          {member.name}
                        </span>
                        <span className="font-mono text-xs tracking-widest text-muted uppercase">
                          {member.position}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
