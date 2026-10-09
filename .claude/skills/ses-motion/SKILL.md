---
name: ses-motion
description: How animation and interactivity are built on the SES website (Motion for React + CSS). Use before adding or changing any animation, transition, hover/press effect, draggable, count-up, scroll reveal, page transition, or interactive widget in this Next.js repo.
---

# SES Motion & Interactivity

Library: **Motion** (`npm i motion`, import from `"motion/react"`). CSS handles simple hover/press
(`press` utility). Motion language: `docs/DESIGN.md` §7.

## Architecture

```
src/lib/motion/tokens.ts      durations, easings, springs, stagger, distances  ← tune the feel here
src/lib/motion/presets.ts     reusable variants built from tokens (fadeUp, popIn, drawPath, …)
src/components/motion/
  MotionProvider.tsx          <MotionConfig reducedMotion="user"> + <LazyMotion features={domAnimation}>
  Reveal.tsx                  animate children when scrolled into view (once)
  Stagger.tsx                 parent that staggers <StaggerItem> children (bento tiles, lists)
  CountUp.tsx                 number counts up when visible; renders final value for SSR/no-JS
  DrawPath.tsx                SVG path draws in (doodle underlines, arrows, circles)
  Draggable.tsx               drag within parent bounds, springs back, keyboard-nudge support
  FlipCard.tsx                front/back flip on click/Enter (team cards)
  Tilt.tsx                    resting tilt that straightens on hover/focus
  Marquee.tsx                 infinite ticker (pauses on hover, static under reduced motion)
  PageTransition.tsx          used by app/template.tsx
src/config/features.ts        flags: { draggableStickers, flipTeamCards, terminalEasterEgg, confettiOnJoin, … }
```

### tokens.ts (starting point)

```ts
export const duration = { fast: 0.15, base: 0.25, slow: 0.4, reveal: 0.5 } as const; // keep fast/base in sync with --ses-duration-* in tokens.css
export const ease = { soft: [0.22, 1, 0.36, 1], brutal: [0.34, 1.56, 0.64, 1] } as const;
export const spring = {
  pop: { type: "spring", stiffness: 420, damping: 24 },
  soft: { type: "spring", stiffness: 220, damping: 28 },
  wobble: { type: "spring", stiffness: 600, damping: 12 },
} as const;
export const stagger = { tiles: 0.07, list: 0.05 } as const;
export const distance = { reveal: 24, lift: 2, pageSlide: 8 } as const;
```

### presets.ts (examples)

```ts
export const fadeUp = { hidden: { opacity: 0, y: distance.reveal }, show: { opacity: 1, y: 0, transition: { duration: duration.reveal, ease: ease.soft } } };
export const popIn  = { hidden: { opacity: 0, y: distance.reveal, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: spring.pop } };
export const staggerParent = (gap = stagger.tiles) => ({ hidden: {}, show: { transition: { staggerChildren: gap } } });
```

## Rules

1. **Never hard-code durations, easings or springs** in components — import from `tokens.ts`.
2. **Sections stay Server Components.** Animation lives in the small client wrappers above:
   ```tsx
   // server component
   <Stagger className="grid …">
     {events.map(e => <StaggerItem key={e.id}><EventTile event={e} /></StaggerItem>)}
   </Stagger>
   ```
   Only add `"use client"` to the wrapper/widget, never to a whole page or section.
3. Use `m.div` (with LazyMotion) instead of `motion.div` to keep the bundle small (NFR-02).
4. Animate only `transform` and `opacity` (and SVG `pathLength`). No animating width/height/top/left
   (use `layout` for size changes).
5. **Reduced motion:** `MotionConfig reducedMotion="user"` disables transform animations automatically;
   additionally use `useReducedMotion()` to stop loops (float, marquee, wobble) and to render CountUp's
   final number immediately. CSS hover effects already respect it via the `press` utility.
6. **Content must be visible without JS.** Motion renders the `initial` (hidden) style into the
   server HTML, so: Reveal/StaggerItem add a `data-reveal` attribute, and `layout.tsx` includes
   `<noscript><style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style></noscript>`.
   Reveal uses `initial="hidden"` + `whileInView="show"` + `viewport={{ once: true, amount: 0.2 }}`.
   Never reveal-animate the hero H1 or LCP image (hurts Largest Contentful Paint) — keep them static
   or animate only decorations around them.
7. **Every interaction works with keyboard and touch**: FlipCard toggles on Enter/Space and announces
   state (`aria-pressed` or live region); Draggable is optional decoration (`aria-hidden`) or offers
   arrow-key nudging; hover-only info must also show on focus/tap.
8. New playful extras go behind a flag in `config/features.ts` so they can be switched off quickly.
9. Keep it snappy: 150–500ms, max one looping animation visible per viewport, no scroll-jacking.

## Recipes

| Effect | How |
|---|---|
| Bento tiles pop in | `<Stagger>` + `<StaggerItem variants={popIn}>` |
| Tile hover lift/press | CSS `press` utility on the tile (no JS) |
| Tilted tile straightens on hover | `<Tilt deg={-1.5}>` or `tilt-l hover:rotate-0 transition-transform` |
| Tile expands into detail | shared `layoutId={\`event-${id}\`}` on tile + detail container, wrap in `<AnimatePresence>` |
| Filter tabs reflow | wrap grid items in `m.div layout` + `<AnimatePresence mode="popLayout">` |
| Count-up stats | `<CountUp to={12} />` (useInView + animate from `motion/react`) |
| Doodle draws in | `<DrawPath d="…" />` animating `pathLength` 0→1 |
| Draggable stickers | `<Draggable constraintsRef={sectionRef}>` with `dragElastic={0.2}` and spring back |
| Countdown flip | client component with `AnimatePresence` per digit, y −100%→0 |
| Page enter | `app/template.tsx` → `<PageTransition>` (opacity + 8px y) |
| Confetti on join success | lazy-import `canvas-confetti` only after successful submit (flag `confettiOnJoin`) |

## Verify

- Toggle "reduce motion" in OS/DevTools (Rendering → emulate prefers-reduced-motion) and check nothing
  moves and all content is visible.
- Check no layout shift (CLS) is introduced by reveals.
- Test keyboard-only and a touch device emulation.
