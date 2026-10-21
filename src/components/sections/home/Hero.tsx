import { Draggable } from "@/components/motion/Draggable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Underline } from "@/components/ui/Doodle";
import { HandNote } from "@/components/ui/HandNote";
import { Highlight } from "@/components/ui/Highlight";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { isEnabled } from "@/config/features";
import { siteConfig } from "@/config/site";
import { homeCopy } from "@/content/home";
import { DepartmentMap, type DepartmentNode } from "./DepartmentMap";

export interface HeroProps {
  departments: DepartmentNode[];
  activeProjects: number;
}

const copy = homeCopy.hero;
const draggable = isEnabled("draggableStickers");

const floatPos = [
  "absolute -left-2 top-2 z-10 hidden max-w-44 lg:block",
  "absolute -left-4 bottom-28 z-10 hidden max-w-44 lg:block",
  "absolute -right-2 bottom-8 z-10 hidden max-w-40 lg:block",
] as const;

/** Homepage hero (DESIGN.md §6.2). The H1 is static (LCP); only its underline draws in. */
export function Hero({ departments, activeProjects }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="py-8 md:py-12">
      <Container>
        <div className="relative brutal rounded-brutal-lg bg-surface dot-grid p-5 shadow-brutal-lg sm:p-8 lg:p-12">
          <Draggable disabled={!draggable} className="absolute -top-4 right-4 z-10 hidden sm:inline-block md:right-8">
            <Sticker color="coral" rotate="6">
              {copy.estSticker}
            </Sticker>
          </Draggable>

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
                <li>
                  <Tag color="blue">{departments.length} teams</Tag>
                </li>
                <li>
                  <Tag color="mint">{activeProjects} projects in motion</Tag>
                </li>
                <li>
                  <Tag color="paper">ideas welcome</Tag>
                </li>
              </ul>
            </div>

            <div className="relative pt-6">
              <Sticker color="yellow" rotate="-3" className="absolute -top-2 left-0 z-10">
                {copy.mapSticker}
              </Sticker>

              {copy.floats.map((float, index) => (
                <Draggable key={float.title} disabled={!draggable} className={floatPos[index]}>
                  <Card
                    color={float.color}
                    tilt={index === 1 ? "right" : "left"}
                    padding="sm"
                    className="pointer-events-none"
                    aria-hidden="true"
                  >
                    <p className="font-mono text-xs font-semibold tracking-widest uppercase">
                      {float.title}
                    </p>
                    <p className="font-hand text-lg leading-tight font-semibold">{float.note}</p>
                  </Card>
                </Draggable>
              ))}

              <DepartmentMap departments={departments} centerLabel="SES core" />

              <HandNote arrow="left" className="mt-3 hidden justify-end lg:flex">
                {copy.vibeNote}
              </HandNote>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
