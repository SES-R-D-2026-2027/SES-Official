import type { Event, EventCategory, TileColor } from "@/types/content";

/** Only the fields the events list needs, so the client bundle never carries long descriptions or galleries. */
export type EventListItem = Pick<
  Event,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "category"
  | "startsAt"
  | "endsAt"
  | "venue"
  | "isOnline"
  | "registrationUrl"
  | "registrationLabel"
  | "badge"
  | "coverImage"
  | "isFeatured"
  | "color"
>;

export function toListItem(event: Event): EventListItem {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    summary: event.summary,
    category: event.category,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    venue: event.venue,
    isOnline: event.isOnline,
    registrationUrl: event.registrationUrl,
    registrationLabel: event.registrationLabel,
    badge: event.badge,
    coverImage: event.coverImage,
    isFeatured: event.isFeatured,
    color: event.color,
  };
}

export const categoryLabel: Record<EventCategory, string> = {
  workshop: "Workshop",
  talk: "Tech talk",
  hackathon: "Hackathon",
  competition: "Competition",
  meetup: "Meetup",
  other: "Event",
};

/** Default tile color per category when an event has no `color` of its own. */
export const categoryColor: Record<EventCategory, TileColor> = {
  workshop: "lilac",
  talk: "coral",
  hackathon: "yellow",
  competition: "mint",
  meetup: "sky",
  other: "paper",
};

export const eventFilters: { value: string; label: string; groups?: EventCategory[] }[] = [
  { value: "all", label: "All" },
  { value: "workshops", label: "Workshops", groups: ["workshop"] },
  { value: "talks", label: "Talks", groups: ["talk"] },
  { value: "hackathons", label: "Hackathons", groups: ["hackathon", "competition"] },
  { value: "meetups", label: "Meetups", groups: ["meetup", "other"] },
];
