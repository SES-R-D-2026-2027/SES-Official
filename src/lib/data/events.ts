import { events as mockEvents } from "@/content/mock/events";
import type { Event } from "@/types/content";
import { getNow } from "./now";
import { fromSource } from "./source";

const byStartAsc = (a: Event, b: Event) => Date.parse(a.startsAt) - Date.parse(b.startsAt);

async function getAllEvents(): Promise<Event[]> {
  return fromSource<Event[]>({
    mock: () => mockEvents,
    api: "/api/public/events",
    tags: ["events"],
  });
}

/** Events that haven't ended yet, soonest first. Featured events are not moved; callers pick. */
export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const [all, now] = await Promise.all([getAllEvents(), getNow()]);
  const upcoming = all
    .filter((event) => Date.parse(event.endsAt ?? event.startsAt) >= now)
    .sort(byStartAsc);
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/** Finished events, most recent first. */
export async function getPastEvents(limit?: number): Promise<Event[]> {
  const [all, now] = await Promise.all([getAllEvents(), getNow()]);
  const past = all
    .filter((event) => Date.parse(event.endsAt ?? event.startsAt) < now)
    .sort((a, b) => byStartAsc(b, a));
  return limit ? past.slice(0, limit) : past;
}
