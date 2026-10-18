import { CalendarDays, MapPin } from "lucide-react";
import { Countdown } from "@/components/motion/Countdown";
import { EmptyState } from "@/components/sections/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatTile } from "@/components/ui/StatTile";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { isEnabled } from "@/config/features";
import { formatShortDate, formatTime, formatWeekday } from "@/lib/utils";
import type { Event } from "@/types/content";
import { categoryColor, categoryLabel } from "./eventUtils";

export interface EventsHeroProps {
  /** The event to spotlight: featured first, otherwise the soonest. */
  next?: Event;
  upcomingCount: number;
  pastCount: number;
  suggestHref: string;
}

/** Page intro: title, two counts taken from real data, and a "next up" card with a live countdown. */
export function EventsHero({ next, upcomingCount, pastCount, suggestHref }: EventsHeroProps) {
  return (
    <Section background="dots" labelledBy="events-title" className="py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-5 lg:items-stretch">
        <div className="flex flex-col gap-8 lg:col-span-3">
          <SectionHeading
            as="h1"
            id="events-title"
            title="Events worth showing up for"
            description="Hands-on workshops, campus hackathons and technical deep-dives, run by students for students."
            tags={[{ label: "Semester schedule", color: "yellow" }]}
            note="free pizza at all talks!"
          />
          <div className="grid max-w-xl grid-cols-2 gap-4">
            <StatTile value={upcomingCount} label="Upcoming" color="yellow" />
            <StatTile value={pastCount} label="Past events" color="mint" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="#all-events" arrow>
              Browse all events
            </Button>
            <Button href={suggestHref} variant="ghost">
              Suggest a talk
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {next ? (
            <Card
              color={next.color ?? categoryColor[next.category]}
              tilt="right"
              shadow="lg"
              sticker={
                <Sticker color="paper" rotate="3">
                  Next up
                </Sticker>
              }
              className="flex h-full flex-col gap-4"
            >
              <Tag color="paper" className="self-start">
                {categoryLabel[next.category]}
              </Tag>
              <h2 className="font-display text-h3 font-bold">{next.title}</h2>
              <ul className="flex flex-col gap-1.5 text-sm">
                <li className="flex items-center gap-2">
                  <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                  <time dateTime={next.startsAt}>
                    {formatWeekday(next.startsAt)}, {formatShortDate(next.startsAt)} ·{" "}
                    {formatTime(next.startsAt)}
                  </time>
                </li>
                {next.venue && (
                  <li className="flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-4 shrink-0" />
                    {next.venue}
                  </li>
                )}
              </ul>
              <p className="text-sm">{next.summary}</p>
              {isEnabled("eventCountdown") && <Countdown to={next.startsAt} />}
              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                {next.registrationUrl && (
                  <Button href={next.registrationUrl} external size="sm">
                    Register<span className="sr-only"> for {next.title}</span>
                  </Button>
                )}
                <Button href={`/events/${next.slug}`} variant="ghost" size="sm" arrow>
                  Details<span className="sr-only">: {next.title}</span>
                </Button>
              </div>
            </Card>
          ) : (
            <EmptyState
              as="h2"
              title="Nothing scheduled yet."
              description="We're planning the next one. Got an idea for a session?"
              note="we're cooking something!"
              color="yellow"
              action={
                <Button href={suggestHref} size="sm" variant="accent" arrow>
                  Suggest a talk
                </Button>
              }
              className="h-full"
            />
          )}
        </div>
      </div>
    </Section>
  );
}
