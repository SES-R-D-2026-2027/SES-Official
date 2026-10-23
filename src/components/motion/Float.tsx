"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { distance, duration } from "@/lib/motion/tokens";

export interface FloatProps {
  /** Seconds before the first bob, so neighbours drift out of step. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Gentle idle bob for decorations (hero badges, stickers). Loops forever, so it renders
 * static for visitors who prefer reduced motion and in the server HTML.
 */
export function Float({ delay = 0, className, children }: FloatProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      animate={{ y: [0, -distance.float, 0] }}
      transition={{ duration: duration.float, ease: "easeInOut", repeat: Infinity, delay }}
    >
      {children}
    </m.div>
  );
}
