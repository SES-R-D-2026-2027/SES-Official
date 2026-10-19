"use client";

import { useId, useState } from "react";
import { HandNote } from "@/components/ui/HandNote";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { tileColor, tileColors } from "@/components/ui/variants";
import { homeCopy } from "@/content/home";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";

const copy = homeCopy.tech;
const colors = tileColors.filter((c) => c !== "paper") as TileColor[];

/** Interactive tech bubbles from Campus Pulse. Keyboard + tap, not hover-only. */
export function TechPlayground() {
  const [active, setActive] = useState<string>(copy.items[0]?.name ?? "");
  const panelId = useId();
  const current = copy.items.find((item) => item.name === active) ?? copy.items[0];

  return (
    <Section id="tech" labelledBy="tech-title">
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="tech-title"
          title={copy.title}
          description={copy.description}
          tags={[{ label: copy.tag, color: "lilac" }]}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <ul className="flex flex-wrap content-start gap-3 lg:col-span-3" aria-label="Topics we play with">
            {copy.items.map((item, index) => {
              const isActive = item.name === active;
              const color = colors[index % colors.length];
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-controls={panelId}
                    onClick={() => setActive(item.name)}
                    className={cn(
                      "press brutal rounded-brutal px-4 py-2 font-display text-base font-bold focus-ring",
                      tileColor({ color }),
                      isActive && "underline decoration-2 underline-offset-4 shadow-brutal-lg",
                    )}
                  >
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            id={panelId}
            aria-live="polite"
            className="flex flex-col gap-3 brutal rounded-brutal-lg bg-surface p-5 lg:col-span-2"
          >
            <Tag color="yellow" className="self-start">
              Tiny taste
            </Tag>
            <p className="font-display text-h3 font-bold">{current?.name}</p>
            <p className="text-muted">{current?.blurb}</p>
            <HandNote>{copy.note}</HandNote>
          </div>
        </div>
      </div>
    </Section>
  );
}
