"use client";

import type { ReactNode } from "react";
import { staggerParent, viewport } from "@/lib/motion/presets";
import { stagger } from "@/lib/motion/tokens";
import { motionElements, revealPresets, type MotionElement, type RevealPreset } from "./elements";

export interface StaggerProps {
  as?: MotionElement;
  /** Gap between children: `tiles` for bento grids, `list` for lists. */
  gap?: keyof typeof stagger;
  className?: string;
  children: ReactNode;
}

/** Parent that reveals its <StaggerItem> children one after another when scrolled into view. */
export function Stagger({ as = "div", gap = "tiles", className, children }: StaggerProps) {
  const Element = motionElements[as];
  return (
    <Element
      className={className}
      variants={staggerParent(stagger[gap])}
      initial="hidden"
      whileInView="show"
      viewport={viewport.stagger}
    >
      {children}
    </Element>
  );
}

export interface StaggerItemProps {
  as?: MotionElement;
  preset?: RevealPreset;
  className?: string;
  children: ReactNode;
}

/** A child of <Stagger>; inherits the hidden → show timing from its parent. */
export function StaggerItem({
  as = "div",
  preset = "popIn",
  className,
  children,
}: StaggerItemProps) {
  const Element = motionElements[as];
  return (
    <Element data-reveal="" className={className} variants={revealPresets[preset]}>
      {children}
    </Element>
  );
}
