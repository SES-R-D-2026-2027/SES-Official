"use client";

import type { ReactNode } from "react";
import { viewport } from "@/lib/motion/presets";
import { motionElements, revealPresets, type MotionElement, type RevealPreset } from "./elements";

export interface RevealProps {
  as?: MotionElement;
  preset?: RevealPreset;
  className?: string;
  id?: string;
  children: ReactNode;
}

/**
 * Animates its children in once, when scrolled into view.
 * Never wrap the hero H1 or the LCP image in this (it delays Largest Contentful Paint).
 * `data-reveal` lets the <noscript> rule in layout.tsx show it without JS.
 */
export function Reveal({ as = "div", preset = "fadeUp", className, id, children }: RevealProps) {
  const Element = motionElements[as];
  return (
    <Element
      id={id}
      data-reveal=""
      className={className}
      variants={revealPresets[preset]}
      initial="hidden"
      whileInView="show"
      viewport={viewport.reveal}
    >
      {children}
    </Element>
  );
}
