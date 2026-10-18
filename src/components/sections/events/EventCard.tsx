import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Wifi } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { calendarDate, formatShortDate, formatTime, formatWeekday } from "@/lib/utils";
import { categoryColor, categoryLabel, type EventListItem } from "./eventUtils";

export interface EventCardProps {
  event: EventListItem;
  /** Past events link to their recap instead of registration. */
  past?: boolean;
}

/** One event row: date block, optional photo, title, meta, summary and actions. */
export function EventCard({ event, past = false }: EventCardProps) {
  const href = `/events/${event.slug}`;
  const month = formatShortDate(event.startsAt).split(" ")[0];
  const day = String(calendarDate(event.startsAt).day).padStart(2, "0");

  return (
    <Card
      as="article"
      color={event.color ?? categoryColor[event.category]}
      sticker={
        event.badge && !past ? (
          <Sticker color="paper" rotate="3">
            {event.badge}
          </Sticker>
        ) : undefined
      }
      className="flex flex-col gap-5 md:flex-row"
    >
      <div
        aria-hidden="true"
        className="hidden shrink-0 flex-col items-center justify-center self-start rounded-brutal-sm bg-surface px-4 py-3 text-center border-brutal md:flex"
      >
        <span className="font-mono text-xs font-semibold tracking-widest uppercase">{month}</span>
        <span className="font-display text-4xl leading-none font-bold">{day}</span>
        <span className="font-mono text-xs">{formatWeekday(event.startsAt)}</span>
      </div>

      {event.coverImage && (
        <div className="relative aspect-video overflow-hidden rounded-brutal-sm bg-surface border-brutal md:aspect-square md:w-36 md:shrink-0 md:self-start">
          <Image
            src={event.coverImage.url}
            alt={event.coverImage.alt}
            fill
            sizes="(min-width: 768px) 144px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tag color="paper">{categoryLabel[event.category]}</Tag>
          {past && <Tag color="paper">Completed</Tag>}
          {event.badge && !past && <span className="sr-only">{event.badge}</span>}
        </div>

        <h3 className="font-display text-h3 font-bold">
          <Link href={href} className="text-ink underline-offset-4 hover:underline focus-ring">
            {event.title}
          </Link>
        </h3>

        <ul className="flex flex-col gap-1.5 text-sm">
          <li className="flex items-center gap-2">
            <Clock aria-hidden="true" className="size-4 shrink-0" />
            <time dateTime={event.startsAt}>
              {formatWeekday(event.startsAt)}, {formatShortDate(event.startsAt)} ·{" "}
              {formatTime(event.startsAt)}
            </time>
          </li>
          <li className="flex items-center gap-2">
            {event.venue ? (
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
            ) : (
              <Wifi aria-hidden="true" className="size-4 shrink-0" />
            )}
            <span>{event.venue ?? (event.isOnline ? "Online" : "Venue to be announced")}</span>
          </li>
        </ul>

        <p className="max-w-prose text-sm">{event.summary}</p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
          {!past && event.registrationUrl && (
            <Button href={event.registrationUrl} external size="sm">
              Register<span className="sr-only"> for {event.title}</span>
            </Button>
          )}
          <Button href={href} variant="ghost" size="sm" arrow>
            {past ? "View recap" : "Details"}
            <span className="sr-only">: {event.title}</span>
          </Button>
          {!past && event.registrationLabel && (
            <p className="text-sm font-medium">{event.registrationLabel}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
