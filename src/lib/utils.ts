import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

// tailwind-merge must know our custom token names, otherwise it treats e.g. `shadow-brutal`
// and `shadow-brutal-lg` as unrelated classes and keeps both.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ["brutal", "brutal-lg", "brutal-none"],
      radius: ["brutal", "brutal-sm", "brutal-lg"],
      font: ["display", "sans", "mono", "hand"],
      text: ["h1", "h2", "h3"],
    },
  },
});

/** Merge class names; later Tailwind classes win over earlier conflicting ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Fixed locale + the campus time zone, so server and client render identical strings
// (no hydration mismatch) and times read as local campus time.
const timeZone = siteConfig.timeZone;

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone,
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  timeZone,
});

const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone });

const partsFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone,
});

/** "08 Nov 2026" */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** "18:30" */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/** "Nov 08" */
export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

/** "Sat" */
export function formatWeekday(iso: string): string {
  return weekdayFormatter.format(new Date(iso));
}

/** Calendar date of an instant in campus time: { year: 2026, month: 11, day: 8 }. */
export function calendarDate(iso: string): { year: number; month: number; day: number } {
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day) };
}

/** "1.2k" for numbers ≥ 1000, used for stars/counters. */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}
