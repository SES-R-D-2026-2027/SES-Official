import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
 * One linked card per department, previewing the current leads and co-leads.
 */
export function DepartmentTeams({ departments }: DepartmentTeamsProps) {
  if (departments.length === 0) return null;
  return (
    <Section labelledBy="departments-title" background="surface" divider>
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="departments-title"
          title="Teams"
          description="Explore all nine teams, meet their leads and co-leads, and open each team’s dedicated page."
          tags={[{ label: `${departments.length} teams`, color: "mint" }]}
          note="we don't bite!"
        />
        <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map(({ department, members }) => (
            <StaggerItem as="li" key={department.id} className="flex">
              <Link
                href={`/departments/${department.slug}`}
                aria-labelledby={`${department.slug}-title`}
                className="group flex w-full rounded-brutal focus-ring"
              >
              <Card
                as="article"
                id={department.slug}
                color={department.color}
                className="flex w-full flex-col gap-4 transition-transform group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
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
                <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-bold">
                  Explore team <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
