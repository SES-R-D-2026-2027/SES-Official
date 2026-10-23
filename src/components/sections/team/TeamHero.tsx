import { Draggable } from "@/components/motion/Draggable";
import { Float } from "@/components/motion/Float";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { Star, Underline } from "@/components/ui/Doodle";
import { HandNote } from "@/components/ui/HandNote";
import { Highlight } from "@/components/ui/Highlight";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { tileColor } from "@/components/ui/variants";
import { isEnabled } from "@/config/features";
import type { Department, TeamMember, TileColor } from "@/types/content";
import { cn } from "@/lib/utils";

export interface TeamHeroProps {
  term: string;
  officers: TeamMember[];
  departments: Department[];
}

const badgeColors: TileColor[] = ["yellow", "mint", "lilac"];
// Scattered resting spots for the officer badges (desktop); they stack on mobile.
const badgePlacement = [
  "lg:max-w-xs lg:self-start",
  "lg:max-w-xs lg:self-end",
  "lg:max-w-xs lg:self-center",
];

/**
 * Team page hero. The heading is static (LCP); the officer badges pop in, bob gently and can be
 * dragged around (they spring back). Department chips jump to that department's card below.
 */
export function TeamHero({ term, officers, departments }: TeamHeroProps) {
  const draggable = isEnabled("draggableStickers");
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
                {officers.length} officers and {departments.length} departments of students who plan
                the events, build the projects and keep the society running.
              </Highlight>

              <nav aria-label="Jump to a department" className="flex flex-col gap-3">
                <HandNote arrow="down" className="pl-1">
                  find your team!
                </HandNote>
                <ul className="flex flex-wrap gap-2">
                  {departments.map((department) => (
                    <li key={department.id}>
                      <a
                        href={`#${department.slug}`}
                        className={cn(
                          "inline-flex press items-center rounded-brutal-sm px-2.5 py-1 text-sm font-semibold shadow-brutal focus-ring border-brutal",
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

            {/* Decorative: the officers are listed properly in the next section. */}
            <div aria-hidden="true" className="relative flex flex-col gap-4 pt-2">
              <Star className="absolute -top-2 right-2 size-8 text-primary" />
              <Stagger className="flex flex-wrap justify-center gap-4 lg:flex-col lg:flex-nowrap">
                {officers.map((officer, i) => (
                  <StaggerItem
                    key={officer.id}
                    className={cn(
                      "w-full sm:w-auto lg:w-full",
                      badgePlacement[i % badgePlacement.length],
                    )}
                  >
                    <Draggable disabled={!draggable} className="block">
                      <Float delay={i * 0.6}>
                        <div
                          className={cn(
                            "flex straighten items-center gap-3 brutal rounded-brutal p-3",
                            i % 2 ? "tilt-r" : "tilt-l",
                            tileColor({ color: badgeColors[i % badgeColors.length] }),
                          )}
                        >
                          <Avatar
                            name={officer.name}
                            src={officer.photo?.url}
                            alt={officer.photo?.alt}
                            fallback="silhouette"
                            color="paper"
                            size="lg"
                          />
                          <span className="flex flex-col">
                            <span className="font-display text-lg leading-tight font-bold">
                              {officer.name}
                            </span>
                            <span className="font-mono text-xs tracking-widest uppercase">
                              {officer.position}
                            </span>
                          </span>
                        </div>
                      </Float>
                    </Draggable>
                  </StaggerItem>
                ))}
              </Stagger>
              {draggable && (
                <HandNote arrow="up" className="self-center">
                  go on, drag us around
                </HandNote>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
