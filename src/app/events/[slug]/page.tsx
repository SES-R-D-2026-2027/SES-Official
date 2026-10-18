import { ArrowLeft, CalendarDays, MapPin, Video } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/sections/events/EventCard";
import { categoryColor, categoryLabel, toListItem } from "@/components/sections/events/eventUtils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/events";
import { buildMetadata } from "@/lib/seo";
import { formatDate, formatTime, formatWeekday } from "@/lib/utils";
import type { Media } from "@/types/content";

type EventPageProps = { params: Promise<{ slug: string }> };

async function loadEvents() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return { upcoming, past };
}

// Pre-render every known event at build time (required by Cache Components for dynamic params).
export async function generateStaticParams() {
  const { upcoming, past } = await loadEvents();
  return [...upcoming, ...past].map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { upcoming, past } = await loadEvents();
  const event = [...upcoming, ...past].find((e) => e.slug === slug);
  if (!event) return buildMetadata({ title: "Event not found", noIndex: true });
  return buildMetadata({
    title: event.title,
    description: event.summary,
    path: `/events/${event.slug}`,
    image: event.coverImage?.url,
  });
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const { upcoming, past } = await loadEvents();
  const event = [...upcoming, ...past].find((e) => e.slug === slug);
  if (!event) notFound();

  const isPast = past.some((e) => e.id === event.id);
  const more = (isPast ? past : upcoming).filter((e) => e.id !== event.id).slice(0, 2);
  const photos = [event.coverImage, ...event.gallery].filter((p): p is Media => Boolean(p));

  return (
    <>
      <Section background="dots" labelledBy="event-title" className="py-12 md:py-16">
        <div className="flex flex-col gap-8">
          <Button
            href="/events"
            variant="ghost"
            size="sm"
            className="self-start"
            icon={<ArrowLeft aria-hidden="true" className="size-4" />}
          >
            All events
          </Button>

          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            <div className="flex flex-col gap-5 lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <Tag color={event.color ?? categoryColor[event.category]}>
                  {categoryLabel[event.category]}
                </Tag>
                {isPast && <Tag color="paper">Completed</Tag>}
                {event.badge && !isPast && <Tag color="yellow">{event.badge}</Tag>}
              </div>
              <h1 id="event-title" className="text-h1 font-bold tracking-tight">
                {event.title}
              </h1>
              <p className="max-w-prose text-lg text-muted">{event.summary}</p>
              <p className="max-w-prose">{event.description}</p>
            </div>

            <Card
              color={event.color ?? categoryColor[event.category]}
              tilt="right"
              shadow="lg"
              sticker={
                event.badge && !isPast ? (
                  <Sticker color="paper" rotate="3">
                    {event.badge}
                  </Sticker>
                ) : undefined
              }
              className="flex flex-col gap-4"
            >
              <h2 className="font-display text-xl font-bold">Details</h2>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <time dateTime={event.startsAt}>
                      {formatWeekday(event.startsAt)}, {formatDate(event.startsAt)} ·{" "}
                      {formatTime(event.startsAt)}
                    </time>
                    {event.endsAt && (
                      <>
                        {" "}
                        until <time dateTime={event.endsAt}>{formatTime(event.endsAt)}</time>
                      </>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span>{event.venue ?? (event.isOnline ? "Online" : "Venue to be announced")}</span>
                </li>
                {event.isOnline && event.onlineUrl && (
                  <li className="flex items-start gap-2">
                    <Video aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    <a
                      href={event.onlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink underline underline-offset-4 focus-ring"
                    >
                      Join online<span className="sr-only"> (opens in new tab)</span>
                    </a>
                  </li>
                )}
              </ul>
              {!isPast && event.registrationLabel && (
                <p className="text-sm font-medium">{event.registrationLabel}</p>
              )}
              {!isPast && event.registrationUrl && (
                <Button href={event.registrationUrl} external>
                  Register<span className="sr-only"> for {event.title}</span>
                </Button>
              )}
            </Card>
          </div>
        </div>
      </Section>

      {photos.length > 0 && (
        <Section background="surface" divider labelledBy="gallery-title">
          <h2 id="gallery-title" className="mb-6 text-h2 font-bold">
            Photos
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <li
                key={photo.url}
                className="relative aspect-4/3 overflow-hidden rounded-brutal bg-surface brutal"
              >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {more.length > 0 && (
        <Section divider labelledBy="more-title">
          <h2 id="more-title" className="mb-6 text-h2 font-bold">
            {isPast ? "More past events" : "More upcoming events"}
          </h2>
          <ul className="flex flex-col gap-6">
            {more.map((e) => (
              <li key={e.id}>
                <EventCard event={toListItem(e)} past={isPast} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
