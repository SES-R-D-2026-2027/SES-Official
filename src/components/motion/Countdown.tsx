"use client";

import { AnimatePresence, m } from "motion/react";
import { useSyncExternalStore } from "react";
import { countdownDigit } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

const units = [
  { key: "days", label: "days", ms: 86_400_000 },
  { key: "hours", label: "hrs", ms: 3_600_000 },
  { key: "minutes", label: "min", ms: 60_000 },
  { key: "seconds", label: "sec", ms: 1_000 },
] as const;

// One shared 1-second clock for every countdown on the page.
let clockNow = 0;
let clockTimer: number | undefined;
const clockListeners = new Set<() => void>();

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (clockTimer === undefined) {
    clockTimer = window.setInterval(() => {
      clockNow = Date.now();
      clockListeners.forEach((notify) => notify());
    }, 1000);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0) {
      window.clearInterval(clockTimer);
      clockTimer = undefined;
    }
  };
}

const getClock = () => (clockNow ||= Date.now());
// The server (and the hydration pass) has no clock: render "--" so the markup matches.
const getServerClock = () => null;

function split(msLeft: number) {
  let rest = Math.max(0, msLeft);
  return units.map((unit) => {
    const value = Math.floor(rest / unit.ms);
    rest -= value * unit.ms;
    return { ...unit, value: String(value).padStart(2, "0") };
  });
}

export interface CountdownProps {
  /** ISO start time. */
  to: string;
  /** Shown once the start time has passed. */
  doneLabel?: string;
  className?: string;
}

/**
 * Live "days / hrs / min / sec" countdown; each digit flips in when it changes.
 * Decorative: the event date is always shown as text next to it, so this is aria-hidden
 * (a ticking value would be noisy for screen readers). The server HTML shows "--" until
 * hydration, so server and client markup match. Reduced motion: digits swap without moving.
 */
export function Countdown({ to, doneLabel = "Happening now!", className }: CountdownProps) {
  const target = Date.parse(to);
  const now = useSyncExternalStore(subscribeClock, getClock, getServerClock);

  if (now !== null && now >= target) {
    return (
      <p aria-hidden="true" className={cn("font-mono text-sm font-semibold uppercase", className)}>
        {doneLabel}
      </p>
    );
  }

  const parts = now === null ? units.map((u) => ({ ...u, value: "--" })) : split(target - now);

  return (
    <div aria-hidden="true" className={cn("flex gap-2", className)}>
      {parts.map((part) => (
        <div
          key={part.key}
          className="flex min-w-14 flex-col items-center rounded-brutal-sm bg-surface px-2 py-1.5 border-brutal"
        >
          <span className="flex overflow-hidden font-display text-2xl leading-none font-bold tabular-nums">
            {part.value.split("").map((digit, index) => (
              <span key={index} className="relative inline-block">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.span
                    key={digit}
                    className="inline-block"
                    variants={countdownDigit}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    {digit}
                  </m.span>
                </AnimatePresence>
              </span>
            ))}
          </span>
          <span className="mt-1 font-mono text-xs tracking-widest uppercase">{part.label}</span>
        </div>
      ))}
    </div>
  );
}
