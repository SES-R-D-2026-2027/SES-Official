import { PlayfulPhysicsField } from "@/components/motion/PlayfulPhysicsField";
import { Container } from "@/components/ui/Container";
import { Underline } from "@/components/ui/Doodle";
import { Highlight } from "@/components/ui/Highlight";
import { HandNote } from "@/components/ui/HandNote";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { tileColor } from "@/components/ui/variants";
import { cn } from "@/lib/utils";
import type { Department, TeamMember, TileColor } from "@/types/content";

export interface TeamHeroProps {
  term: string;
  officers: TeamMember[];
  officerCount: number;
  departments: Department[];
}

const badgeColors: TileColor[] = ["yellow", "mint", "lilac", "sky"];

/** Team page hero. The officer cards and SES spheres share one bounded physics field. */
export function TeamHero({ term, officers, officerCount, departments }: TeamHeroProps) {
  return (
    <section aria-labelledby="team-title" className="py-8 md:py-12">
      <Container>
        <div className="relative brutal rounded-brutal-lg bg-surface dot-grid p-5 shadow-brutal-lg sm:p-8 lg:p-12">
          <Sticker color="coral" rotate="6" className="absolute -top-4 right-4 z-10 md:right-8">
            {term}
          </Sticker>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
            <div className="flex flex-col items-start gap-6">
              <Tag color="yellow">Leadership &amp; team</Tag>

              <h1 id="team-title" className="text-h1 font-bold tracking-tight text-ink">
                The people behind{" "}
                <span className="relative inline-block text-link">
                  SES.
                  <Underline draw className="absolute -bottom-2 left-0 h-3 w-full text-link" />
                </span>
              </h1>

              <Highlight className="max-w-xl">
                {officerCount} officers and {departments.length} teams of students who plan
                the events, build the projects and keep the society running.
              </Highlight>

              <nav aria-label="Visit a department page" className="flex flex-col gap-3">
                <p className="font-hand text-lg">Choose a team</p>
                <ul className="flex flex-wrap gap-2">
                  {departments.map((department) => (
                    <li key={department.id}>
                      <a
                        href={`/departments/${department.slug}`}
                        className={cn(
                          "inline-flex items-center rounded-brutal-sm border-brutal px-2.5 py-1 text-sm font-semibold shadow-brutal focus-ring hover:-translate-y-0.5",
                          tileColor({ color: department.color ?? "paper" }),
                        )}
                      >
                        {department.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="relative min-w-0 pt-2">
              <PlayfulPhysicsField
                label="Interactive SES leadership cards and logo spheres"
                heightClassName="min-h-[28rem] sm:min-h-[30rem]"
                cards={officers.map((officer, index) => ({
                  id: `team-${officer.id}`,
                  title: officer.name,
                  note: officer.position,
                  color: badgeColors[index % badgeColors.length],
                  image: officer.photo?.url,
                  imageAlt: officer.photo?.alt,
                }))}
              />
              <HandNote decorative={false} className="mt-3 w-full justify-center text-center text-2xl font-semibold sm:text-3xl">
                Drag cards, click and launch SES!
              </HandNote>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
