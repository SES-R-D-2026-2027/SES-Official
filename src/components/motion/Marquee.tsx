"use client";

import { Pause, Play } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
  /** Names the ticker region for screen readers. */
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * Infinite horizontal ticker (CSS animation, `marquee` utility).
 * Pauses on hover, on keyboard focus inside, and with the pause button (WCAG 2.2.2).
 * Under reduced motion it is static and wraps; the duplicate copy is hidden.
 */
export function Marquee({ label, className, children }: MarqueeProps) {
  const [paused, setPaused] = useState(false);

  return (
    <section aria-label={label} className={cn("relative flex items-center gap-3", className)}>
      <div
        className="marquee min-w-0 flex-1 overflow-hidden contain-inline-size"
        data-paused={paused}
      >
        <div data-marquee-track="" className="flex w-max">
          <div className="flex shrink-0 items-center gap-8 pr-8">{children}</div>
          {/* second copy makes the loop seamless; hidden from AT and keyboard */}
          <div
            data-marquee-copy=""
            aria-hidden="true"
            inert
            className="flex shrink-0 items-center gap-8 pr-8"
          >
            {children}
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
        className="inline-flex size-9 shrink-0 press items-center justify-center brutal rounded-brutal-sm bg-surface text-ink focus-ring motion-reduce:hidden"
      >
        {paused ? (
          <Play aria-hidden="true" className="size-4" />
        ) : (
          <Pause aria-hidden="true" className="size-4" />
        )}
        <span className="sr-only">Pause ticker</span>
      </button>
    </section>
  );
}
