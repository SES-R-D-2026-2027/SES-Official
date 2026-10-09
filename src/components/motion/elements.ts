import { m } from "motion/react";
import { fadeIn, fadeUp, popIn } from "@/lib/motion/presets";

// Shared lookups for the motion wrappers. Server components pass names (strings),
// never variant objects, across the client boundary.

export const motionElements = {
  div: m.div,
  section: m.section,
  article: m.article,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  span: m.span,
} as const;

export type MotionElement = keyof typeof motionElements;

export const revealPresets = { fadeUp, fadeIn, popIn } as const;

export type RevealPreset = keyof typeof revealPresets;
