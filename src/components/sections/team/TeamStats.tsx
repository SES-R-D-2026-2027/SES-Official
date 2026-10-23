import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/ui/Section";
import { StatTile } from "@/components/ui/StatTile";
import type { TileColor } from "@/types/content";

export interface TeamStatsProps {
  items: { value: number; suffix?: string; label: string; color: TileColor; note?: string }[];
}

/** Count-up stat tiles for the team page (2×2 on mobile). */
export function TeamStats({ items }: TeamStatsProps) {
  return (
    <Section labelledBy="team-stats-title" className="py-4 md:py-6">
      <h2 id="team-stats-title" className="sr-only">
        The team in numbers
      </h2>
      <Stagger as="ul" className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {items.map((item) => (
          <StaggerItem as="li" key={item.label} className="flex">
            <StatTile {...item} className="w-full" />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
