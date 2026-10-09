---
name: ses-build-section
description: Step-by-step recipe for building a new page, homepage section, bento grid, or component on the SES website. Use when adding or restructuring any page or section in this Next.js repo.
---

# Building a page or section

Also load `ses-design-system` (styling) and `ses-motion` (animation). Requirements and sitemap:
`docs/REQUIREMENTS.md`. Look/feel: `docs/DESIGN.md` + `docs/reference/`.

## Recipe

1. **Find the requirement.** Which FR does this serve? Which fields must it show (see FR table and
   `docs/API-CONTRACT.md`)? Stay inside scope (no member login, external registration links only).
2. **Data first.** Make sure the type exists in `src/types/content.ts`, mock data exists in
   `src/content/mock/`, and a getter exists in `src/lib/data/` (load `ses-content-data` if not).
3. **Compose from primitives.** Use `components/ui/*` and `components/bento/*`. If you need a new
   primitive, create it in `ui/` (generic) — not inside the section.
4. **Build the section as a Server Component** in `components/sections/<page>/<Name>.tsx`:
   - receives typed props (`{ events: Event[] }`), no fetching inside
   - wraps itself in `<Section>` (handles padding, background color/dot-grid, `aria-labelledby`)
   - heading via `<SectionHeading tag="SEMESTER SCHEDULE" note="free pizza at all talks!" action={…}>`
5. **Add motion** with wrappers (`<Stagger>`, `<Reveal>`, `<CountUp>`, `<DrawPath>`). No inline
   animation code.
6. **Wire the route** in `src/app/<route>/page.tsx`: call the data getter, render sections, export
   metadata with `buildMetadata()`. For `[slug]` routes add `generateStaticParams` and `notFound()`.
7. **Empty/edge states.** No upcoming events? Show `<EmptyState>` with a playful note. Long titles,
   missing images (use a colored placeholder tile with a sticker), 1 vs 10 items.
8. **Responsive pass** at 360 / 768 / 1280. Bento → 1 column on mobile, featured tile first.
   Hide/shrink stickers that would overlap text.
9. **Checks:** `npm run lint`, `npm run typecheck`, visual check in the browser, keyboard-only pass,
   reduced-motion pass.

## Bento grids

Use the shared components, not ad-hoc grids:

```tsx
<BentoGrid cols={{ base: 1, md: 2, lg: 4 }}>
  <BentoTile size="2x2" color="yellow" href={`/events/${featured.slug}`}>…</BentoTile>
  <BentoTile size="1x1" color="lilac">…</BentoTile>
  <BentoTile size="2x1" color="sky">…</BentoTile>
</BentoGrid>
```

- `size` ∈ `1x1 | 2x1 | 1x2 | 2x2` → col/row span classes defined once in `BentoTile`.
- `color` from the tile palette; neighbouring tiles should not share a color.
- `tilt` ∈ `none | left | right` (use on max 1–2 tiles per grid).
- Clickable tiles render as a link with `press` and a clear accessible name.
- Use `grid-auto-flow: dense` so mixed sizes pack without holes; test with fewer items than designed.

## Copy tone

Short, casual, student voice: "We don't bite!", "Built at 3 AM. Tested on production.",
"Got an idea? Suggest a talk!". Keep official facts (dates, venues, requirements) plain and clear.
Never invent real-sounding numbers or names — use placeholders marked `// TODO(content)`.
