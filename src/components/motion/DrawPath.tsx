"use client";

import { m, useReducedMotion, type Variants } from "motion/react";
import { drawPath, viewport } from "@/lib/motion/presets";

// Under reduced motion the path appears in one step instead of drawing.
const instant: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0 } },
};

export interface DrawPathProps {
  d: string;
  className?: string;
}

/**
 * An SVG <path> that draws itself in once visible. Use inside an aria-hidden <svg>.
 * `data-reveal` lets the <noscript> rule show the full path without JS.
 */
export function DrawPath({ d, className }: DrawPathProps) {
  const reduce = useReducedMotion();
  return (
    <m.path
      d={d}
      data-reveal=""
      className={className}
      variants={reduce ? instant : drawPath}
      initial="hidden"
      whileInView="show"
      viewport={viewport.draw}
    />
  );
}
