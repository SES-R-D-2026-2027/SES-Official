---
name: ses-design-system
description: SES website visual system (neobrutalist, vibrant). Use before changing colors, fonts, borders, shadows, radii, themes, or building/editing UI primitives in this Next.js repo.
---

# SES Design System

Full spec: `docs/DESIGN.md`. Approved look: `docs/reference/homepage-v1.png` (open it with Read).

## Where things live

| Thing | File |
|---|---|
| Palette, semantic colors, radii, border width, shadow offset, tilt, themes | `src/styles/tokens.css` |
| Custom utilities (`brutal`, `border-brutal`, `press`, `tilt-l/r`, `dot-grid`, `focus-ring`) | `src/styles/globals.css` |
| Fonts (next/font → CSS variables) | `src/styles/fonts.ts` |
| Primitives | `src/components/ui/*` |
| Tile color variant map | `src/components/ui/variants.ts` (single `tileColor` cva map reused everywhere) |

## Rules

1. Never write hex/rgb, arbitrary values (`bg-[#…]`, `shadow-[…]`) or font names in components.
   Use utilities generated from tokens: `bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `bg-primary`,
   `text-on-primary`, `bg-accent`, `bg-highlight`, `text-link`, `bg-tile-{yellow|mint|lilac|coral|sky|blue|paper}`,
   `shadow-brutal(-lg|-none)`, `rounded-brutal(-sm|-lg)`, `font-display|sans|mono|hand`, `ease-brutal|soft`.
2. Tailwind's default color palette is disabled on purpose (`--color-*: initial`). If you need a new
   color, add it to the palette (Layer 1), give it a semantic name (Layer 2), expose it in `@theme inline`
   (Layer 3), and document it in `docs/DESIGN.md`.
3. The standard box is `brutal` (border + radius + hard shadow). Clickable boxes add `press`.
   Buttons are always `brutal press focus-ring`.
4. Color is a prop, not a class soup: `<BentoTile color="mint">`, `<Tag color="coral">`, `<Button variant="accent">`.
   Map props → classes once in `variants.ts`.
5. Text on colored tiles is always `text-ink`. White text only on `bg-primary`. Check contrast ≥ 4.5:1
   for any new pairing (large display text ≥ 3:1).
6. Handwritten font (`font-hand`) is for short side-notes and captions only, never for essential info.
   Mono labels ≥ 11px.
7. Decorative elements (stickers, doodles, hand notes that repeat info) get `aria-hidden="true"` and
   `pointer-events-none` unless interactive. They must never overlap text at any breakpoint — hide or
   shrink them on mobile.
8. Spacing uses Tailwind's default spacing scale; sections use `py-16 md:py-24`, container max-w ~1200px
   with `px-4 md:px-6`.

## Adding a theme

1. Copy the `[data-theme="neo"]` block in `tokens.css` to `[data-theme="<name>"]` and remap values
   (e.g. `--ses-border-width: 1px; --ses-shadow-offset: 0px; --ses-tilt: 0deg;` for a minimal look).
2. Switch `data-theme` on `<html>` in `src/app/layout.tsx` (or read it from `config/site.ts`).
3. No component should need changes. If one does, it is using a raw value — fix the component.

## Primitive checklist (when creating/editing one)

- Typed props, `className` merged via `cn()`, `forwardRef` for focusable elements, `asChild`-style
  polymorphism only if needed (`as="a"`).
- Variants with cva; defaults match the approved screenshot.
- Keyboard + focus ring + accessible name. External links get icon + sr-only "(opens in new tab)".
- No data fetching and no animation logic inside primitives (wrap with motion components instead).
