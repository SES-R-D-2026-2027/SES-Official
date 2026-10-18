import { Suspense } from "react";
import { EventCard } from "@/components/sections/events/EventCard";
import { EventsExplorer } from "@/components/sections/events/EventsExplorer";
import { EventsHero } from "@/components/sections/events/EventsHero";
import { toListItem } from "@/components/sections/events/eventUtils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Sticker";
import { homeCopy } from "@/content/home";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/events";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Events",
  description:
    "Workshops, hackathons, tech talks and competitions run by the Software Engineering Society at FAST-NUCES. See what's coming up and what you missed.",
  path: "/events",
});

const suggest = homeCopy.events.suggest;

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  const next = upcoming.find((event) => event.isFeatured) ?? upcoming[0];
  const upcomingItems = upcoming.map(toListItem);
  const pastItems = past.map(toListItem);

  return (
    <>
      <EventsHero
        next={next}
        upcomingCount={upcoming.length}
        pastCount={past.length}
        suggestHref={suggest.href}
      />

      <Section id="all-events" labelledBy="all-events-title" background="surface" divider>
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="all-events-title"
            title="Find your next event"
            description="Filter by type, search by topic, or pick a day on the calendar."
            tags={[{ label: "All events", color: "sky" }]}
          />
          {/* The list is static HTML first (good for SEO and no layout shift); the client explorer takes over. */}
          <Suspense
            fallback={
              <ul className="flex flex-col gap-6">
                {upcomingItems.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            }
          >
            <EventsExplorer upcoming={upcomingItems} past={pastItems} suggestHref={suggest.href} />
          </Suspense>
        </div>
      </Section>

      <Section labelledBy="suggest-title">
        <Card
          color="mint"
          tilt="left"
          shadow="lg"
          sticker={
            <Sticker color="yellow" rotate="6">
              Your turn
            </Sticker>
          }
          className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 id="suggest-title" className="text-h3 font-bold">
              {suggest.title} Run a session with us.
            </h2>
            <p>{suggest.body} Tell us the topic and we&apos;ll help you plan it.</p>
          </div>
          <Button href={suggest.href} variant="accent" arrow>
            Suggest a talk
          </Button>
        </Card>
      </Section>
    </>
  );
}
