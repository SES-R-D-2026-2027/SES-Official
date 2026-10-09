import type { Variants } from "motion/react";
import { distance, duration, ease, spring, stagger } from "./tokens";

// Reusable variants. Every motion wrapper uses the "hidden" → "show" pair.

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.soft } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.reveal },
  show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.soft } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, y: distance.reveal, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.pop },
};

export const drawPath: Variants = {
  hidden: { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: duration.reveal, ease: ease.soft } },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: distance.pageSlide },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.soft } },
};

/** Full-screen overlays (mobile menu): slide down in, quick fade out. */
export const overlay: Variants = {
  hidden: { opacity: 0, y: -distance.pageSlide },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.soft } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: ease.soft } },
};

/** Countdown digit flip: new digit drops in from above, old one drops out below. */
export const countdownDigit: Variants = {
  hidden: { y: "-100%", opacity: 0 },
  show: { y: 0, opacity: 1, transition: spring.pop },
  exit: { y: "100%", opacity: 0, transition: { duration: duration.fast, ease: ease.soft } },
};

/** Filter reflow: tiles leaving the grid shrink and fade (entering ones use popIn). */
export const tileExit: Variants = {
  exit: { opacity: 0, scale: 0.96, transition: { duration: duration.fast, ease: ease.soft } },
};

/** whileInView settings: animate once, when this share of the element is visible. */
export const viewport = {
  reveal: { once: true, amount: 0.2 },
  stagger: { once: true, amount: 0.1 },
  draw: { once: true, amount: 0.6 },
} as const;

export const staggerParent = (gap: number = stagger.tiles): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
});
