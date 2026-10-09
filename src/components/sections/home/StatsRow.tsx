import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/ui/Section";
import { StatTile } from "@/components/ui/StatTile";
import type { SiteStats } from "@/types/content";

export interface StatsRowProps {
  stats: SiteStats;
}

/** Four colored stat tiles that count up when visible (2×2 on mobile). */
export function StatsRow({ stats }: StatsRowProps) {
  if (stats.items.length === 0) return null;
  return (
    <Section labelledBy="stats-title" className="py-8 md:py-12">
      <h2 id="stats-title" className="sr-only">
        SES in numbers
      </h2>
      <Stagger as="ul" className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {stats.items.map((item) => (
          <StaggerItem as="li" key={item.label} className="flex">
            <StatTile
              value={item.value}
              suffix={item.suffix}
              label={item.label}
              description={item.description}
              note={item.note}
              color={item.color}
              className="w-full"
            />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
