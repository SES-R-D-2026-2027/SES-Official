"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface CalendarMonth {
  year: number;
  /** 1-12 */
  month: number;
}

export interface EventsCalendarProps {
  value: CalendarMonth;
  onChange: (next: CalendarMonth) => void;
  /** Keys ("2026-11-8") of days that have at least one event. */
  markedDays: ReadonlySet<string>;
  /** Currently selected day key, if any. */
  selected: string | null;
  onSelect: (key: string) => void;
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const dayKey = (year: number, month: number, day: number) => `${year}-${month}-${day}`;

/** Month grid with event days highlighted. Pure calendar math on UTC dates, so it renders the same everywhere. */
export function EventsCalendar({
  value,
  onChange,
  markedDays,
  selected,
  onSelect,
}: EventsCalendarProps) {
  const { year, month } = value;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7; // Monday first
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => cells[w * 7 + d] ?? null),
  );
  const title = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));

  const shift = (delta: number) => {
    const index = year * 12 + (month - 1) + delta;
    onChange({ year: Math.floor(index / 12), month: (index % 12) + 1 });
  };

  const navButton =
    "press brutal inline-flex size-8 items-center justify-center rounded-brutal-sm bg-surface focus-ring";

  return (
    <Card color="sky" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => shift(-1)} className={navButton}>
          <ChevronLeft aria-hidden="true" className="size-4" />
          <span className="sr-only">Previous month</span>
        </button>
        <h3 className="text-center font-display text-lg font-bold">{title}</h3>
        <button type="button" onClick={() => shift(1)} className={navButton}>
          <ChevronRight aria-hidden="true" className="size-4" />
          <span className="sr-only">Next month</span>
        </button>
      </div>

      <table className="w-full text-center font-mono text-xs">
        <caption className="sr-only">
          {title}. Days with events are buttons that filter the list.
        </caption>
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
              {week.map((day, d) => {
                if (!day) return <td key={d} />;
                const key = dayKey(year, month, day);
                const marked = markedDays.has(key);
                return (
                  <td key={d} className="p-0.5">
                    {marked ? (
                      <button
                        type="button"
                        aria-pressed={selected === key}
                        onClick={() => onSelect(key)}
                        className={cn(
                          "press inline-flex size-8 items-center justify-center rounded-full font-bold border-brutal focus-ring",
                          selected === key ? "bg-ink text-surface" : "bg-accent text-on-accent",
                        )}
                      >
                        {day}
                        <span className="sr-only"> (has events)</span>
                      </button>
                    ) : (
                      <span className="inline-flex size-8 items-center justify-center">{day}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
