import { PlayfulPhysicsField } from "@/components/motion/PlayfulPhysicsField";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Underline } from "@/components/ui/Doodle";
import { HandNote } from "@/components/ui/HandNote";
import { Highlight } from "@/components/ui/Highlight";
import { Tag } from "@/components/ui/Tag";
import { siteConfig } from "@/config/site";
import { homeCopy } from "@/content/home";
import { DepartmentMap, type DepartmentNode } from "./DepartmentMap";

export interface HeroProps {
  departments: DepartmentNode[];
  activeProjects: number;
}

const copy = homeCopy.hero;
/** Homepage hero. Movable cards live in a dedicated tray below the map and copy. */
export function Hero({ departments, activeProjects }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="py-8 md:py-12">
      <Container>
        <div className="relative brutal rounded-brutal-lg bg-surface dot-grid p-5 shadow-brutal-lg sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col items-start gap-6">
              <Tag color="yellow" className="whitespace-normal">
                {copy.tag}
              </Tag>

              <h1 id="hero-title" className="text-h1 font-bold tracking-tight text-ink">
                {copy.titleLead}{" "}
                <span className="relative inline-block text-link">
                  {copy.titleHighlight}
                  <Underline draw className="absolute -bottom-2 left-0 h-3 w-full text-link" />
                </span>
                <span className="mt-1 block">{copy.titleRest}</span>
              </h1>

              <Highlight className="max-w-xl">{copy.intro}</Highlight>

              <div className="flex flex-col items-start gap-3">
                <div className="flex flex-wrap gap-3">
                  <Button href={siteConfig.cta.href} arrow>
                    {copy.joinLabel}
                  </Button>
                  <Button href={copy.seeHref} variant="ghost">
                    {copy.seeLabel}
                  </Button>
                </div>
                <HandNote arrow="left" className="pl-1">
                  {copy.note}
                </HandNote>
              </div>

              <ul className="flex flex-wrap gap-2" aria-label="SES at a glance">
                <li><Tag color="blue">{departments.length} teams</Tag></li>
                <li><Tag color="mint">{activeProjects} projects in motion</Tag></li>
                <li><Tag color="paper">ideas welcome</Tag></li>
              </ul>
            </div>

            <div className="relative flex min-h-[31rem] items-center justify-center px-2 py-6 sm:px-5">
              <DepartmentMap departments={departments} centerLabel="SES core" />
            </div>
          </div>

          <div className="mt-6">
            <PlayfulPhysicsField
              label="SES logo and card physics playground"
              cards={copy.floats.map((float, index) => ({
                id: `home-${index}`,
                title: float.title,
                note: float.note,
                color: float.color,
              }))}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
