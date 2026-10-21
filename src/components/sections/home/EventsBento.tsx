import { FilterGrid, type FilterGridFixed } from "@/components/motion/FilterGrid";
import { EmptyState } from "@/components/sections/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeCopy } from "@/content/home";
import type { Event } from "@/types/content";
import {
  CalendarTile,
  EventTile,
  FeaturedEventTile,
  LastEventTile,
  PastEventsTile,
  SuggestTile,
} from "./EventTiles";

export interface EventsBentoProps {
  /** Soonest first. */
  upcoming: Event[];
  /** Most recent first. */
  past: Event[];
}

const copy = homeCopy.events;

const filters = [
  { value: "all", label: "All" },
  { value: "workshops", label: "Workshops", groups: ["workshop"] },
  { value: "social", label: "Social", groups: ["meetup"] },
  { value: "talks", label: "Talks", groups: ["talk"] },
  { value: "hackathons", label: "Hackathons", groups: ["hackathon", "competition"] },
];

/**
 * Upcoming events bento (DESIGN.md §6.5): featured 2×2 + two 1×1 events + mini calendar,
 * then last-event polaroid, suggest-a-talk CTA and past-events collage. Filter tabs reflow
 * the event tiles; the other tiles stay. A featured event (isFeatured) leads "All".
 */
export function EventsBento({ upcoming, past }: EventsBentoProps) {
  // Featured events first, otherwise soonest first (stable sort keeps date order).
  const ordered = [...upcoming].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  const items = ordered.map((event) => ({
    id: event.id,
    group: event.category,
    featured: <FeaturedEventTile event={event} />,
    compact: <EventTile event={event} />,
  }));

  const fixed: FilterGridFixed[] = [];
  if (upcoming.length > 0) {
    fixed.push({ id: "calendar", size: "2x1", node: <CalendarTile events={upcoming} /> });
  }
  if (past[0]) {
    fixed.push({ id: "last", size: "1x1", node: <LastEventTile event={past[0]} /> });
  }
  fixed.push({ id: "suggest", size: "1x1", node: <SuggestTile {...copy.suggest} /> });
  if (past.length > 0) {
    fixed.push({
      id: "past",
      size: "2x1",
      node: <PastEventsTile events={past} href="/events?timeline=past" />,
    });
  }

  return (
    <Section id="events" labelledBy="events-title">
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="events-title"
          title={copy.title}
          description={copy.description}
          tags={[{ label: copy.tag, color: "yellow" }]}
          note={copy.note}
          action={
            <Button href="/events" variant="ghost" size="sm" arrow>
              View full calendar
            </Button>
          }
        />
        <FilterGrid
          label="Filter events by type"
          noun="events"
          filters={filters}
          items={items}
          limit={3}
          fixed={fixed}
          empty={
            <EmptyState
              title="Nothing scheduled here yet."
              description="We're planning the next one. Got an idea for a session?"
              note="we're cooking something!"
              action={
                <Button href={copy.suggest.href} variant="accent" size="sm" arrow>
                  Suggest a talk
                </Button>
              }
            />
          }
        />
      </div>
    </Section>
  );
}
