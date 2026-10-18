"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { EmptyState } from "@/components/sections/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { tileColor } from "@/components/ui/variants";
import { calendarDate, cn } from "@/lib/utils";
import { EventCard } from "./EventCard";
import { dayKey, EventsCalendar, type CalendarMonth } from "./EventsCalendar";
import { categoryLabel, eventFilters, type EventListItem } from "./eventUtils";

type Timeline = "upcoming" | "past";

export interface EventsExplorerProps {
  /** Soonest first. */
  upcoming: EventListItem[];
  /** Most recent first. */
  past: EventListItem[];
  suggestHref: string;
}

const chip = (pressed: boolean) =>
  cn(
    "press brutal rounded-brutal-sm px-3 py-1.5 font-mono text-xs font-semibold tracking-widest uppercase focus-ring",
    pressed ? "bg-ink text-surface" : tileColor({ color: "paper" }),
  );

const keyOf = (iso: string) => {
  const { year, month, day } = calendarDate(iso);
  return dayKey(year, month, day);
};

/**
 * Entry point. Reads ?timeline=past (the homepage "past events" tile links there) and remounts the
 * explorer when it changes, so the state always matches the URL without effects.
 * Must sit inside <Suspense> because it reads search params.
 */
export function EventsExplorer(props: EventsExplorerProps) {
  const timeline: Timeline = useSearchParams().get("timeline") === "past" ? "past" : "upcoming";
  return <Explorer key={timeline} initialTimeline={timeline} {...props} />;
}

function Explorer({
  upcoming,
  past,
  suggestHref,
  initialTimeline,
}: EventsExplorerProps & { initialTimeline: Timeline }) {
  const [timeline, setTimeline] = useState<Timeline>(initialTimeline);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [month, setMonth] = useState<CalendarMonth | null>(() => {
    const first = (initialTimeline === "past" ? past[0] : upcoming[0]) ?? upcoming[0] ?? past[0];
    if (!first) return null;
    const date = calendarDate(first.startsAt);
    return { year: date.year, month: date.month };
  });
  const searchId = useId();
  const statusId = useId();

  // Which timeline each event day belongs to (drives the calendar and day clicks).
  const markedDays = useMemo(() => {
    const map = new Map<string, Timeline>();
    for (const e of past) map.set(keyOf(e.startsAt), "past");
    for (const e of upcoming) map.set(keyOf(e.startsAt), "upcoming");
    return map;
  }, [upcoming, past]);

  const markedSet = useMemo(() => new Set(markedDays.keys()), [markedDays]);

  const visible = useMemo(() => {
    const groups = eventFilters.find((f) => f.value === filter)?.groups;
    const needle = query.trim().toLowerCase();
    return (timeline === "past" ? past : upcoming).filter((e) => {
      if (groups && !groups.includes(e.category)) return false;
      if (selectedDay && keyOf(e.startsAt) !== selectedDay) return false;
      if (!needle) return true;
      return `${e.title} ${e.summary} ${e.venue ?? ""} ${categoryLabel[e.category]}`
        .toLowerCase()
        .includes(needle);
    });
  }, [timeline, filter, query, selectedDay, upcoming, past]);

  const filtered = filter !== "all" || query !== "" || selectedDay !== null;
  const reset = () => {
    setFilter("all");
    setQuery("");
    setSelectedDay(null);
  };

  const pickDay = (key: string) => {
    if (selectedDay === key) return setSelectedDay(null);
    setSelectedDay(key);
    setTimeline(markedDays.get(key) ?? timeline);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Show upcoming or past events" className="flex gap-2">
          {(["upcoming", "past"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={timeline === value}
              aria-describedby={statusId}
              onClick={() => setTimeline(value)}
              className={chip(timeline === value)}
            >
              {value === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <label htmlFor={searchId} className="sr-only">
            Search events
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events"
            className="brutal w-full rounded-brutal-sm bg-surface py-2 pr-3 pl-9 text-base focus-ring"
          />
        </div>
      </div>

      <div role="group" aria-label="Filter events by type" className="flex flex-wrap gap-2">
        {eventFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            aria-describedby={statusId}
            onClick={() => setFilter(f.value)}
            className={chip(filter === f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p id={statusId} role="status" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? "event" : "events"}
      </p>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {filtered && (
            <p className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-widest uppercase">
              {visible.length} {visible.length === 1 ? "result" : "results"}
              <Button size="sm" variant="ghost" onClick={reset}>
                Clear filters
              </Button>
            </p>
          )}
          {visible.length > 0 ? (
            <ul className="flex flex-col gap-6">
              {visible.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} past={timeline === "past"} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title={filtered ? "No events match." : "Nothing scheduled here yet."}
              description={
                filtered
                  ? "Try another type, or clear the search."
                  : "We're planning the next one. Got an idea for a session?"
              }
              note={filtered ? undefined : "we're cooking something!"}
              action={
                filtered ? (
                  <Button size="sm" variant="accent" onClick={reset}>
                    Clear filters
                  </Button>
                ) : (
                  <Button href={suggestHref} size="sm" variant="accent" arrow>
                    Suggest a talk
                  </Button>
                )
              }
            />
          )}
        </div>

        {month && (
          <aside aria-label="Event calendar" className="lg:sticky lg:top-24">
            <EventsCalendar
              value={month}
              onChange={setMonth}
              markedDays={markedSet}
              selected={selectedDay}
              onSelect={pickDay}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
