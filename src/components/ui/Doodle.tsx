import type { ReactNode } from "react";
import { DrawPath } from "@/components/motion/DrawPath";
import { cn } from "@/lib/utils";

// Hand-drawn SVG doodles. Always decorative (aria-hidden), colored with currentColor
// (set it with a text-* class). `draw` makes the stroke draw itself in when visible.

const paths = {
  underline: { viewBox: "0 0 200 20", stretch: true, d: "M3 14 C40 5 80 6 112 11 S172 17 197 7" },
  circle: {
    viewBox: "0 0 200 80",
    d: "M150 9 C104 0 24 6 9 36 C-2 62 78 78 132 72 C182 66 202 40 187 22 C176 10 148 5 118 9",
  },
  arrow: { viewBox: "0 0 100 60", d: "M6 52 C28 24 58 12 90 15 M77 4 L91 15 L79 28" },
  star: {
    viewBox: "0 0 48 48",
    d: "M24 4 L29 18 L44 18 L32 27 L37 42 L24 33 L11 42 L16 27 L4 18 L19 18 Z",
  },
  squiggle: {
    viewBox: "0 0 200 24",
    stretch: true,
    d: "M2 12 C14 2 26 2 38 12 S62 22 74 12 S98 2 110 12 S134 22 146 12 S170 2 182 12 S194 20 198 16",
  },
} as const;

export type DoodleName = keyof typeof paths;

export interface DoodleProps {
  /** Draw the stroke in when scrolled into view (static under reduced motion / no JS). */
  draw?: boolean;
  className?: string;
}

function DoodleSvg({ name, draw, className }: DoodleProps & { name: DoodleName }) {
  const { viewBox, d } = paths[name];
  // Lines (underline, squiggle) stretch to the box they're given; shapes keep their proportions.
  const stretch = "stretch" in paths[name];
  const path: ReactNode = draw ? <DrawPath d={d} /> : <path d={d} />;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio={stretch ? "none" : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("pointer-events-none overflow-visible", className)}
    >
      {path}
    </svg>
  );
}

export const Underline = (props: DoodleProps) => <DoodleSvg name="underline" {...props} />;
export const Circle = (props: DoodleProps) => <DoodleSvg name="circle" {...props} />;
export const Arrow = (props: DoodleProps) => <DoodleSvg name="arrow" {...props} />;
export const Star = (props: DoodleProps) => <DoodleSvg name="star" {...props} />;
export const Squiggle = (props: DoodleProps) => <DoodleSvg name="squiggle" {...props} />;

/** Namespace export: <Doodle.Underline draw className="text-link" /> */
export const Doodle = { Underline, Circle, Arrow, Star, Squiggle };
