import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/ui/Section";
import { StatTile } from "@/components/ui/StatTile";
import type { TileColor } from "@/types/content";

export interface EventsStatsProps {
  /** Counts taken from the real event list, never invented. */
  items: { label: string; value: number; description: string; color: TileColor }[];
}

/** Colored count-up tiles, same row as the homepage stats. */
export function EventsStats({ items }: EventsStatsProps) {
  return (
    <Section labelledBy="events-stats-title" className="py-8 md:py-12">
      <h2 id="events-stats-title" className="sr-only">
        Events in numbers
      </h2>
      <Stagger as="ul" className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {items.map((item) => (
          <StaggerItem as="li" key={item.label} className="flex">
            <StatTile
              value={item.value}
              label={item.label}
              description={item.description}
              color={item.color}
              className="w-full"
            />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
