# SES Website — Design System & Homepage Spec

Approved look: `docs/reference/homepage-v1.png` (neobrutalist, vibrant, student-made).
This file is the source of truth for visual decisions. Code lives in `src/styles/tokens.css`
and `src/lib/motion/tokens.ts`; keep them in sync with this document.

---

## 1. Personality

- **Student-made, not corporate.** Raw outlines, hard shadows, slightly tilted cards, stickers,
  handwritten side-notes, polaroid photos, casual copy ("we don't bite!", "free pizza at all talks!").
- **Vibrant.** Every section/tile gets its own color from the tile palette. SES blue stays the brand color.
- **Perfectly imperfect, but readable.** Imperfection comes from tilt, doodles and stickers — never
  from broken spacing, low contrast or overlapping text.
- **Alive.** Things pop in, lift on hover, press on click, draw themselves, can be dragged.

## 2. Token architecture (3 layers)

```
Layer 1  PALETTE      --palette-*        raw hex values (ONLY place hex codes exist)
Layer 2  SEMANTIC     --ses-*            meaning per theme: bg, ink, primary, tile-yellow, border width…
Layer 3  TAILWIND     @theme inline      exposes semantic tokens as utilities: bg-bg, text-ink,
                                         bg-tile-mint, shadow-brutal, rounded-brutal, font-display…
```

Components only use Layer 3 utilities (or the custom `@utility` classes below).
A new theme = a new `[data-theme="…"]` block that remaps Layer 2. Nothing else changes.

## 3. `tokens.css` (starting point — Tailwind CSS v4)

> Tailwind v4 no longer uses `tailwind.config.js` for theme values; the theme lives in CSS via
> `@theme`. This file plays the role of the config.

```css
/* src/styles/tokens.css */

/* ───────── Layer 1 · PALETTE ───────── */
:root {
  --palette-ink: #0e1530;
  --palette-paper: #fffbf2;
  --palette-white: #ffffff;
  --palette-gray: #4b5470;        /* muted text, 7:1 on paper */
  --palette-blue: #3b63a8;        /* SES brand blue */
  --palette-blue-bright: #2f5bd3; /* links, focus, "students." */
  --palette-blue-pale: #dce6f7;
  --palette-yellow: #ffd84d;
  --palette-yellow-pale: #fff3b8;
  --palette-mint: #7ee0a8;
  --palette-lilac: #b9a6ff;
  --palette-coral: #ff7a90;
  --palette-sky: #8fd3ff;
}

/* ───────── Layer 2 · SEMANTIC (theme: neo) ───────── */
:root,
[data-theme="neo"] {
  --ses-bg: var(--palette-paper);
  --ses-surface: var(--palette-white);
  --ses-ink: var(--palette-ink);
  --ses-muted: var(--palette-gray);
  --ses-primary: var(--palette-blue);
  --ses-on-primary: var(--palette-white);
  --ses-accent: var(--palette-yellow);
  --ses-on-accent: var(--palette-ink);
  --ses-highlight: var(--palette-yellow-pale);
  --ses-link: var(--palette-blue-bright);
  --ses-focus: var(--palette-blue-bright);

  --ses-tile-yellow: var(--palette-yellow);
  --ses-tile-mint: var(--palette-mint);
  --ses-tile-lilac: var(--palette-lilac);
  --ses-tile-coral: var(--palette-coral);
  --ses-tile-sky: var(--palette-sky);
  --ses-tile-blue: var(--palette-blue-pale);
  --ses-tile-paper: var(--palette-white);

  --ses-border-width: 2px;
  --ses-radius-sm: 6px;
  --ses-radius: 10px;
  --ses-radius-lg: 16px;
  --ses-shadow-offset: 4px;
  --ses-shadow-offset-lg: 7px;
  --ses-tilt: 1.5deg;
  --ses-dot: color-mix(in oklab, var(--ses-ink) 12%, transparent);

  --ses-duration-fast: 150ms;     /* keep in sync with lib/motion/tokens.ts */
  --ses-duration-base: 250ms;
}

/* Example of a future theme — only remap Layer 2:
[data-theme="minimal"] { --ses-border-width: 1px; --ses-shadow-offset: 0px; --ses-tilt: 0deg; … } */

/* ───────── Layer 3 · TAILWIND THEME ───────── */
@theme {
  --color-*: initial; /* remove Tailwind's default palette so only SES tokens exist */
}

@theme inline {
  --color-white: var(--palette-white);
  --color-bg: var(--ses-bg);
  --color-surface: var(--ses-surface);
  --color-ink: var(--ses-ink);
  --color-muted: var(--ses-muted);
  --color-primary: var(--ses-primary);
  --color-on-primary: var(--ses-on-primary);
  --color-accent: var(--ses-accent);
  --color-on-accent: var(--ses-on-accent);
  --color-highlight: var(--ses-highlight);
  --color-link: var(--ses-link);
  --color-focus: var(--ses-focus);
  --color-tile-yellow: var(--ses-tile-yellow);
  --color-tile-mint: var(--ses-tile-mint);
  --color-tile-lilac: var(--ses-tile-lilac);
  --color-tile-coral: var(--ses-tile-coral);
  --color-tile-sky: var(--ses-tile-sky);
  --color-tile-blue: var(--ses-tile-blue);
  --color-tile-paper: var(--ses-tile-paper);

  --font-display: var(--font-space-grotesk), system-ui, sans-serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
  --font-hand: var(--font-caveat), cursive;

  --radius-brutal-sm: var(--ses-radius-sm);
  --radius-brutal: var(--ses-radius);
  --radius-brutal-lg: var(--ses-radius-lg);

  --shadow-brutal: var(--ses-shadow-offset) var(--ses-shadow-offset) 0 0 var(--ses-ink);
  --shadow-brutal-lg: var(--ses-shadow-offset-lg) var(--ses-shadow-offset-lg) 0 0 var(--ses-ink);
  --shadow-brutal-none: 0 0 0 0 var(--ses-ink);

  --ease-brutal: cubic-bezier(0.34, 1.56, 0.64, 1); /* small overshoot = playful */
  --ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Custom utilities (in `globals.css`):

```css
@utility border-brutal { border: var(--ses-border-width) solid var(--ses-ink); }
@utility brutal {             /* the standard neobrutalist box */
  border: var(--ses-border-width) solid var(--ses-ink);
  border-radius: var(--ses-radius);
  box-shadow: var(--shadow-brutal);
}
@utility press {              /* hover lift + click press, used by buttons and clickable tiles */
  transition: transform var(--ses-duration-fast) var(--ease-soft),
              box-shadow var(--ses-duration-fast) var(--ease-soft);
  &:hover { transform: translate(-2px, -2px); box-shadow: var(--shadow-brutal-lg); }
  &:active { transform: translate(var(--ses-shadow-offset), var(--ses-shadow-offset)); box-shadow: var(--shadow-brutal-none); }
  @media (prefers-reduced-motion: reduce) { &:hover, &:active { transform: none; } }
}
@utility tilt-l { rotate: calc(var(--ses-tilt) * -1); }
@utility tilt-r { rotate: var(--ses-tilt); }
@utility dot-grid {
  background-image: radial-gradient(var(--ses-dot) 1px, transparent 1px);
  background-size: 20px 20px;
}
@utility focus-ring {
  &:focus-visible { outline: 3px solid var(--ses-focus); outline-offset: 3px; }
}
```

Added in Phase 2 (see `globals.css` / `tokens.css` for the code):

| Token / utility | Purpose |
|---|---|
| `border-b-brutal`, `border-t-brutal` | single-side brutal border (sticky header, footer) |
| `straighten` | tilted element rotates to 0 on hover / focus-within (no transition under reduced motion) |
| `marquee` + `--ses-marquee-duration` (30s) | CSS ticker used by `<Marquee>`; pauses on hover/focus/button, static under reduced motion |
| `--ses-bento-row` (`minmax(10rem, auto)`) | bento row height from md up, used as `md:auto-rows-(--ses-bento-row)` |
| `text-h1` / `text-h2` / `text-h3` | the fluid heading scale from §4 as `@theme` font-size tokens |
| `press` | now also transitions `rotate`, so clickable tilted tiles straighten smoothly |

## 4. Typography

| Role | Font (next/font/google) | Use |
|---|---|---|
| Display | **Space Grotesk** 500/700 | H1–H3, stat numbers, big CTA |
| Body | **Inter** 400/500/600 | paragraphs, UI |
| Mono | **JetBrains Mono** 500 | small uppercase labels/tags (`OPEN REGISTRATION`), dates, status bar |
| Hand | **Caveat** 500/700 | handwritten notes, polaroid captions (max ~6 words, never for important info) |

Scale (fluid with `clamp`): H1 40→72px, H2 28→40px, H3 20→24px, body 16–17px, labels 11–12px uppercase
with +0.08em tracking. Mono labels must stay ≥ 11px (readable on mobile).

## 5. Components (visual rules)

- **Button** — `brutal press`, mono or sans 600. Variants: `primary` (bg-primary, text-on-primary),
  `accent` (yellow), `mint`, `ghost` (surface). Arrow icon slides 2px on hover.
- **Card / BentoTile** — `brutal`, color variant from tile palette, padding 20–28px, optional tilt,
  optional sticker in a corner (`absolute -top-3 right-4`), clickable tiles also get `press`.
- **Tag** — mono uppercase label in a small bordered pill/rectangle, colored background.
- **Sticker** — rotated (−6°…6°) tag/SVG with border + shadow (`NEW`, `LIMITED SEATS`, hexagon).
  Decorative → `aria-hidden`. Optionally draggable (feature flag).
- **Polaroid** — white frame, thick bottom margin with a Caveat caption, tilted, brutal shadow.
- **HandNote** — Caveat text + small doodle arrow, colored ink (must still meet 4.5:1 on its background).
- **Highlight** — paragraph sitting in a pale-yellow bordered block (as in the hero).
- **Doodles** — SVG underline / circle / arrow / star / squiggle that can "draw" on scroll.
- **Background** — paper color with subtle `dot-grid` in hero and selected sections.

## 6. Homepage spec (top → bottom)

Reference: `docs/reference/homepage-v1.png`. Changes vs the screenshot are marked **(new)**.

1. **Header** — sticky, paper bg, bottom border. Left: yellow "SES" logo chip + small version tag
   + handwritten "student run!". Center: About, Events, Projects, Research, Resources. Right: "Join now →"
   (primary) + yellow square menu button (opens full menu). Mobile: logo + menu button → full-screen menu.
2. **Hero** — big bordered paper card with dot grid. Tag "STUDENT-RUN ENGINEERING COLLECTIVE".
   H1 "Software, built together by **students.**" ("students." in link-blue with a hand-drawn underline
   that draws in). Intro paragraph in a Highlight block. Buttons: "Join SES →" (primary),
   "Register for Hackathon (Nov 08) →" (mint, external link). HandNote "start here! no experience needed"
   pointing at the button. Small chip row: departments count · active projects · "Open Source".
   Right side: coral rotated sticker "EST. CAMPUS LAB" + **(new, simplified)** an interactive hexagon
   map of the departments (hover/tap a node → short description), replacing the dense diagram.
3. **Stats row** — 4 tiles (yellow, mint, lilac, coral), big Space Grotesk number with count-up,
   mono label, one-line description, small HandNote ("all active!", "join us!").
4. **Lab life** — "Built at 3 AM. Tested on production." + short casual paragraph + 2–3 tilted
   polaroids with captions ("Hackathon '25, 3am, still debugging"). Mono tag "LIFE IN THE LAB".
5. **Upcoming events — (new) bento grid**
   ```
   ┌───────────────────────┬───────────┬───────────┐
   │ FEATURED EVENT (2×2)  │ Workshop  │ Tech talk │
   │ photo, date, venue,   │  (1×1)    │  (1×1)    │
   │ countdown, Register → ├───────────┴───────────┤
   │                       │ Mini calendar (2×1)   │
   ├───────────┬───────────┼───────────────────────┤
   │ Last event│ Suggest a │ Past events photo     │
   │ polaroid  │ talk! CTA │ collage (2×1)         │
   └───────────┴───────────┴───────────────────────┘
   ```
   Header row: tag "SEMESTER SCHEDULE", HandNote "free pizza at all talks!", "View full calendar →".
   Optional filter tabs (All / Workshops / Talks / Hackathons) that reflow tiles with layout animation.
6. **Featured projects — (new) bento grid**
   ```
   ┌───────────┬───────────────────────┬───────────┐
   │ GitHub    │ FEATURED PROJECT (2×2)│ Project 2 │
   │ stats     │ screenshot, stack,    ├───────────┤
   ├───────────┤ stars, Live demo →    │ Project 3 │
   │ Tech stack│                       │           │
   │ stickers  │                       │           │
   ├───────────┴───────────┬───────────┴───────────┤
   │ Your project here —   │ Contributor avatars   │
   │ looking for devs!     │ "N students shipped"  │
   └───────────────────────┴───────────────────────┘
   ```
   Header: tags "SHIPPED CODE" + "100% OPEN SOURCE", "Explore all repositories →".
7. **Latest announcements** — bordered list card: date chip, category tag (colored), title, one-line
   summary, "Read →" button. **(new)** Fill the empty right side with a doodle/sticker cluster or small
   photo; never leave a blank half.
8. **Join CTA** — big coral block, tilted "NOW ACCEPTING" sticker, tag "GET INVOLVED TODAY",
   H2 "Come build with us." in **ink (not white — contrast fix)**, white bordered text box,
   buttons "Join SES →" + "Explore our Discord", HandNote "we don't bite!".
9. **Footer** — logo + short description + socials; columns Explore / Learn / Connect with colored
   mono labels; bottom bar "SES // RUNS ON OPEN SOURCE & STUDENT OBSESSION" + "STATUS: ALL NODES
   OPERATIONAL" chip. © current year.

**Mobile:** all bento grids collapse to 1 column (featured tile first), stats become 2×2,
polaroids become a horizontal swipe row, stickers shrink or hide if they would cover content.

## 7. Motion language (see `ses-motion` skill for implementation)

| Moment | Behavior |
|---|---|
| Section/tiles enter | pop in with stagger: opacity 0→1, y 24→0, scale 0.96→1, slight overshoot |
| Hover (clickable) | lift −2px, shadow 4→7px, tilted tiles straighten |
| Press | push into shadow (translate by offset, shadow → 0) |
| Tile → detail | shared-element expand (`layoutId`) |
| Filter change | tiles reflow with `layout` animation |
| Numbers | count up once when visible |
| Doodles | SVG path draws in when visible |
| Stickers | idle float/wobble; draggable when feature flag on |
| Page change | quick fade + 8px slide |

Durations 150–500ms. Under `prefers-reduced-motion: reduce`: no movement/scale, only opacity fades;
no autoplay loops.

## 8. Accessibility checklist (NFR-03)

- Text contrast ≥ 4.5:1 (large text ≥ 3:1). Ink on every tile color passes; white text only on `primary`.
- Visible focus ring on every interactive element (`focus-ring`).
- Decorative stickers/doodles/handnotes that repeat info: `aria-hidden="true"`.
- Draggable/flip/hover interactions must also work with keyboard (Enter/Space) and touch.
- One H1 per page, headings in order, landmarks (header/nav/main/footer), skip link.
