"use client";

import { RotateCw } from "lucide-react";
import { m } from "motion/react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { spring } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

export interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  /** Names the card for the flip button: "Flip {label} card". */
  label: string;
  className?: string;
  /** Show both faces stacked, no flipping (e.g. `!features.flipTeamCards`). */
  disabled?: boolean;
}

/**
 * Two-sided card. Click/tap anywhere (outside links/buttons) or use the flip button
 * (Enter/Space, announces state with aria-pressed). The hidden face is inert.
 * Under reduced motion MotionConfig makes the flip instant.
 */
export function FlipCard({ front, back, label, className, disabled }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  if (disabled) {
    return (
      <div className={cn("grid gap-4", className)}>
        {front}
        {back}
      </div>
    );
  }

  function onCardClick(event: MouseEvent<HTMLDivElement>) {
    // Let links and buttons inside a face work normally.
    if ((event.target as HTMLElement).closest("a, button, input, select, textarea")) return;
    setFlipped((value) => !value);
  }

  return (
    <div className={cn("relative perspective-distant", className)} onClick={onCardClick}>
      <m.div
        className="grid cursor-pointer transform-3d"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={spring.soft}
      >
        <div
          className="col-start-1 row-start-1 backface-hidden"
          aria-hidden={flipped}
          inert={flipped}
        >
          {front}
        </div>
        <div
          className="col-start-1 row-start-1 rotate-y-180 backface-hidden"
          aria-hidden={!flipped}
          inert={!flipped}
        >
          {back}
        </div>
      </m.div>
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((value) => !value)}
        className="absolute right-3 bottom-3 z-10 inline-flex size-10 press items-center justify-center brutal rounded-full bg-surface text-ink focus-ring"
      >
        <RotateCw aria-hidden="true" className="size-4" />
        <span className="sr-only">Flip {label} card</span>
      </button>
    </div>
  );
}
