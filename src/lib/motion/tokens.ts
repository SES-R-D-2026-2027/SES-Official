// Tune the feel of every animation here (docs/DESIGN.md §7).
// Keep `fast` / `base` in sync with --ses-duration-* in src/styles/tokens.css.

// `count` is the one long duration: a number ticking up (<CountUp>), nothing moves on screen.
export const duration = { fast: 0.15, base: 0.25, slow: 0.4, reveal: 0.5, count: 1.2 } as const;

export const ease = {
  soft: [0.22, 1, 0.36, 1],
  brutal: [0.34, 1.56, 0.64, 1],
} as const;

export const spring = {
  pop: { type: "spring", stiffness: 420, damping: 24 },
  soft: { type: "spring", stiffness: 220, damping: 28 },
  wobble: { type: "spring", stiffness: 600, damping: 12 },
} as const;

export const stagger = { tiles: 0.07, list: 0.05 } as const;

// `nudge` = how far one arrow-key press moves a <Draggable>.
export const distance = { reveal: 24, lift: 2, pageSlide: 8, nudge: 8 } as const;
