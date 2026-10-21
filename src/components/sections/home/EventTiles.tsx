import { ArrowRight, CalendarDays, Clock, Lightbulb, MapPin, Wifi } from "lucide-react";
import Image from "next/image";
import { BentoTile } from "@/components/bento/BentoTile";
import { Countdown } from "@/components/motion/Countdown";
import { Button } from "@/components/ui/Button";
import { Polaroid } from "@/components/ui/Polaroid";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { isEnabled } from "@/config/features";
import type { Event, EventCategory, Media, TileColor } from "@/types/content";
import { calendarDate, cn, formatDate, formatTime, formatWeekday } from "@/lib/utils";

// Tiles for the homepage events bento (DESIGN.md §6.5). All are Server Components; the
// FilterGrid island decides which event tiles show. Grid cells are <li>, so tiles render as
// a <div> without their own reveal (the grid animates the cells).

export const categoryLabel: Record<EventCategory, string> = {
  workshop: "Workshop",
  talk: "Tech talk",
  hackathon: "Hackathon",
  competition: "Competition",
  meetup: "Meetup",
  other: "Event",
};

const cell = { as: "div", animate: false, cellClassName: "w-full" } as const;

/** Visual "Details →" at the bottom of a tile that is itself a link. */
function MoreLink({ children }: { children: string }) {
  return (
    <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4">
      {children}
      <ArrowRight aria-hidden="true" className="size-4" />
    </span>
  );
}

function EventMeta({ event }: { event: Event }) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      <li className="flex items-center gap-2">
        <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
        <span>
          <time dateTime={event.startsAt}>
            {formatWeekday(event.startsAt)}, {formatDate(event.startsAt)}
          </time>{" "}
          · {formatTime(event.startsAt)}
        </span>
      </li>
      <li className="flex items-center gap-2">
        {event.venue ? (
          <MapPin aria-hidden="true" className="size-4 shrink-0" />
        ) : (
          <Wifi aria-hidden="true" className="size-4 shrink-0" />
        )}
        <span>
          {event.venue ?? (event.isOnline ? "Online" : "Venue to be announced")}
          {event.venue && event.isOnline && " · also online"}
        </span>
      </li>
    </ul>
  );
}

/** 2×2 featured event: photo, date, venue, live countdown, Register →. */
export function FeaturedEventTile({ event }: { event: Event }) {
  const detailsHref = `/events/${event.slug}`;
  return (
    <BentoTile
      {...cell}
      color={event.color ?? "yellow"}
      sticker={
        event.badge && (
          <Sticker color="paper" rotate="3">
            {event.badge}
          </Sticker>
        )
      }
      className="gap-4"
    >
      {event.coverImage && (
        <div className="relative aspect-video overflow-hidden rounded-brutal-sm bg-surface border-brutal lg:aspect-5/2">
          <Image
            src={event.coverImage.url}
            alt={event.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 560px, (min-width: 768px) 90vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Tag color="paper">{categoryLabel[event.category]}</Tag>
        {event.badge && <span className="sr-only">{event.badge}</span>}
      </div>
      <h3 className="text-h3 font-bold">{event.title}</h3>
      <EventMeta event={event} />
      <p className="text-sm">{event.summary}</p>
      {isEnabled("eventCountdown") && (
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-1.5 font-mono text-xs font-medium tracking-widest uppercase">
            <Clock aria-hidden="true" className="size-3.5" />
            Starts in
          </p>
          <Countdown to={event.startsAt} />
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
        {event.registrationUrl && (
          <Button href={event.registrationUrl} external size="sm">
            Register<span className="sr-only"> for {event.title}</span>
          </Button>
        )}
        <Button href={detailsHref} variant="ghost" size="sm" arrow>
          Details<span className="sr-only">: {event.title}</span>
        </Button>
        {event.registrationLabel && (
          <p className="text-sm font-medium">{event.registrationLabel}</p>
        )}
      </div>
    </BentoTile>
  );
}

/** 1×1 event: the whole tile links to the event page. */
export function EventTile({ event }: { event: Event }) {
  return (
    <BentoTile
      {...cell}
      href={`/events/${event.slug}`}
      color={event.color ?? "paper"}
      sticker={
        event.badge && (
          <Sticker color="paper" rotate="-3">
            {event.badge}
          </Sticker>
        )
      }
    >
      <Tag color="paper" className="self-start">
        {categoryLabel[event.category]}
      </Tag>
      <p className="font-mono text-xs font-medium tracking-widest uppercase">
        <time dateTime={event.startsAt}>
          {formatWeekday(event.startsAt)} {formatDate(event.startsAt)} ·{" "}
          {formatTime(event.startsAt)}
        </time>
      </p>
      <h3 className="line-clamp-3 font-display text-lg leading-snug font-bold">{event.title}</h3>
      <p className="flex items-center gap-1.5 text-sm">
        <MapPin aria-hidden="true" className="size-4 shrink-0" />
        <span className="line-clamp-1">
          {event.venue ?? (event.isOnline ? "Online" : "Venue TBA")}
        </span>
      </p>
      {event.badge && <span className="sr-only">{event.badge}</span>}
      <MoreLink>Details</MoreLink>
    </BentoTile>
  );
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthName = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** 2×1 mini month calendar with event days marked, for the month of the next event. */
export function CalendarTile({ events }: { events: Event[] }) {
  const first = events[0];
  if (!first) return null;
  const { year, month } = calendarDate(first.startsAt);
  const inMonth = events.filter((e) => {
    const d = calendarDate(e.startsAt);
    return d.year === year && d.month === month;
  });
  const eventDays = new Set(inMonth.map((e) => calendarDate(e.startsAt).day));

  // Calendar arithmetic on plain dates (UTC), independent of the visitor's time zone.
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7; // Monday first
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => cells[w * 7 + d] ?? null),
  );
  const title = monthName.format(new Date(Date.UTC(year, month - 1, 1)));

  return (
    <BentoTile {...cell} color="sky" className="gap-4 sm:flex-row">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <table className="w-full max-w-64 text-center font-mono text-xs">
          <caption className="sr-only">{title}, event days highlighted</caption>
          <thead>
            <tr>
              {weekdays.map((day) => (
                <th key={day} scope="col" className="pb-1 font-medium">
                  <span aria-hidden="true">{day[0]}</span>
                  <span className="sr-only">{day}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, w) => (
              <tr key={w}>
                {week.map((day, d) => (
                  <td key={d} className="p-0.5">
                    {day && (
                      <span
                        className={cn(
                          "inline-flex size-6 items-center justify-center rounded-full",
                          eventDays.has(day) && "bg-accent font-bold border-brutal",
                        )}
                      >
                        {day}
                        {eventDays.has(day) && <span className="sr-only"> (event)</span>}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex min-w-0 flex-1 flex-col gap-2 sm:pl-2">
        {inMonth.slice(0, 4).map((event) => (
          <li key={event.id} className="flex items-baseline gap-2 text-sm">
            <span className="shrink-0 rounded-brutal-sm bg-surface px-1.5 font-mono text-xs font-semibold border-brutal">
              {String(calendarDate(event.startsAt).day).padStart(2, "0")}
            </span>
            <span className="line-clamp-2">{event.title}</span>
          </li>
        ))}
      </ul>
    </BentoTile>
  );
}

/** 1×1 polaroid of the most recent past event. */
export function LastEventTile({ event }: { event: Event }) {
  const image = event.coverImage ?? event.gallery[0];
  return (
    <BentoTile {...cell} href={`/events/${event.slug}`} color="paper" className="gap-2">
      <Tag color="lilac" className="self-start">
        Last event
      </Tag>
      <Polaroid
        image={image && { src: image.url, alt: image.alt }}
        caption="missed it? next time!"
        tilt="right"
        sizes="(min-width: 1024px) 220px, (min-width: 768px) 45vw, 90vw"
        className="mx-auto w-full max-w-56"
      />
      <h3 className="line-clamp-2 text-sm font-semibold">{event.title}</h3>
    </BentoTile>
  );
}

/** 1×1 "Got an idea? Suggest a talk!" CTA. */
export function SuggestTile({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <BentoTile {...cell} href={href} color="mint" tilt="left">
      <Lightbulb aria-hidden="true" className="size-8" />
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="text-sm">{body}</p>
      <MoreLink>Bring it</MoreLink>
    </BentoTile>
  );
}

const collageTilt = ["-rotate-3", "rotate-2", "-rotate-1"];
const collageFallback: TileColor[] = ["yellow", "mint", "coral"];

/** 2×1 photo collage from past events. */
export function PastEventsTile({ events, href }: { events: Event[]; href: string }) {
  const photos: Media[] = events
    .flatMap((event) => [event.coverImage, ...event.gallery])
    .filter((photo): photo is Media => Boolean(photo))
    .slice(0, 3);

  return (
    <BentoTile {...cell} href={href} color="blue" className="gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-2 sm:w-2/5">
        <Tag color="paper" className="self-start">
          Past events
        </Tag>
        <h3 className="font-display text-xl font-bold">The photo dump</h3>
        <p className="text-sm">{events.length} past events and counting. Browse the archive.</p>
      </div>
      <ul aria-hidden="true" className="flex flex-1 justify-center -space-x-6">
        {(photos.length ? photos : collageFallback).map((photo, i) => (
          <li
            key={i}
            className={cn(
              "relative aspect-square w-28 overflow-hidden brutal rounded-brutal-sm bg-surface",
              collageTilt[i],
            )}
          >
            {typeof photo === "string" ? (
              <Sticker shape="hexagon" color={photo} rotate="0" className="m-auto size-full p-4" />
            ) : (
              <Image src={photo.url} alt="" fill sizes="112px" className="object-cover" />
            )}
          </li>
        ))}
      </ul>
    </BentoTile>
  );
}
