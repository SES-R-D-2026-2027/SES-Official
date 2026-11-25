import Image from "next/image";
import { Draggable } from "@/components/motion/Draggable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Underline } from "@/components/ui/Doodle";
import { HandNote } from "@/components/ui/HandNote";
import { Highlight } from "@/components/ui/Highlight";
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
const floatPositions = [
  "absolute left-[5%] top-3 z-10 w-40 max-w-[43%] sm:left-[8%] sm:top-4 sm:w-48",
  "absolute right-[5%] top-3 z-10 w-40 max-w-[43%] sm:left-[42%] sm:right-auto sm:top-4 sm:w-48",
  "absolute bottom-3 left-[28%] z-10 w-40 max-w-[43%] sm:bottom-4 sm:left-auto sm:right-[8%] sm:w-44",
] as const;

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

            <div className="relative flex min-h-[27rem] items-center justify-center px-2 py-6 sm:px-8">
              <DepartmentMap departments={departments} centerLabel="SES core" />
            </div>
          </div>

          <div
            aria-label="Movable society cards"
            role="group"
            className="relative mt-6 min-h-[17rem] overflow-hidden rounded-brutal-lg border-2 border-dashed border-ink/25 bg-bg/50 sm:min-h-[14rem]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center gap-12 opacity-20 sm:gap-24">
              {[0, 1, 2].map((item) => (
                <span key={item} className="inline-block animate-bounce" style={{ animationDelay: `${item * 180}ms`, animationDuration: `${1.8 + item * 0.25}s` }}>
                  <Image src="/brand/ses-logo-light.png" alt="" width={64} height={64} className="ses-logo-light size-12 object-contain sm:size-16" />
                  <Image src="/brand/ses-logo-dark.png" alt="" width={64} height={64} className="ses-logo-dark size-12 object-contain sm:size-16" />
                </span>
              ))}
            </div>
            {copy.floats.map((float, index) => (
              <Draggable
                key={float.title}
                disabled={!draggable}
                label={float.title}
                persistKey={`hero-float-v2-${index}`}
                className={floatPositions[index]}
              >
                <Card
                  color={float.color}
                  tilt={index === 1 ? "right" : "left"}
                  padding="sm"
                  className="w-full select-none"
                >
                  <p className="font-mono text-xs font-semibold tracking-widest uppercase">
                    {float.title}
                  </p>
                  <p className="font-hand text-lg leading-tight font-semibold">{float.note}</p>
                </Card>
              </Draggable>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
