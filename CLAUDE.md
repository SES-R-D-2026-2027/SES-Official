# ses-web — SES Website Frontend

Official website of the **Software Engineering Society (SES), FAST-NUCES**, a student-run society.
The site must feel **student-made, playful and "perfectly imperfect"** (neobrutalist, vibrant colors,
stickers, handwritten notes, polaroids), while staying fast, accessible and easy to maintain.

**Stack:** Next.js (App Router) · TypeScript (strict) · Tailwind CSS v4 · Motion (`motion/react`) ·
cva + clsx + tailwind-merge · lucide-react · Zod.

**This repo is the frontend only.** The backend is a **separate repo, `ses-api`** (Express +
JavaScript + MongoDB). This repo talks to it over HTTP (`API_URL`) and never imports its code.
Until the API is ready, the site runs on typed mock data.

## Docs & skills

```
docs/
├─ DESIGN.md         visual system, tokens, homepage spec  ← source of truth for design
├─ REQUIREMENTS.md   SoW summary: FR-01..FR-12, NFR-01..NFR-09, out of scope, sitemap
├─ API-CONTRACT.md   data shapes + endpoints (copy of the master in ses-api; check the version)
└─ reference/        design screenshots (homepage-v1.png = approved homepage look)
.claude/skills/      load the matching skill before working in that area
```

| Skill | Use it when |
|---|---|
| `ses-design-system` | Touching colors, fonts, spacing, borders, shadows, themes, or UI primitives |
| `ses-motion` | Adding or changing any animation, transition, or interactive behavior |
| `ses-build-section` | Building a new page, homepage section, bento grid, or component |
| `ses-content-data` | Adding content types, mock data, or switching data from mocks to the API |

## Folder structure

```
ses-web/
├─ public/
│  ├─ images/            photos (events/, team/, projects/, lab/, placeholder/)
│  └─ stickers/          SVG stickers + doodles (hexagon, star, arrow, squiggle…)
└─ src/
   ├─ app/                         routes only — thin files that fetch data and compose sections
   │  ├─ layout.tsx                fonts, <html data-theme>, Header, Footer, MotionProvider
   │  ├─ template.tsx              page-enter transition (PageTransition)
   │  ├─ page.tsx                  Home
   │  ├─ about/  departments/[slug]/  team/  events/[slug]/  projects/[slug]/
   │  ├─ research/[slug]/  technology/  resources/  announcements/[slug]/  contact/  join/
   │  ├─ styleguide/               living design reference (noindex)
   │  ├─ not-found.tsx  sitemap.ts  robots.ts
   │  └─ (admin)/admin/            FR-12 admin panel UI (calls ses-api) — LATER PHASE, do not build yet
   ├─ components/
   │  ├─ ui/                       primitives: Button, Card, Tag, Sticker, Polaroid, HandNote,
   │  │                            Highlight, Doodle (Underline/Circle/Arrow/Star), Container,
   │  │                            Section, SectionHeading, StatTile, Avatar, Input, Textarea, Select
   │  │                            variants.ts = shared tile-color/size cva maps
   │  ├─ layout/                   Header, MobileMenu, Footer, SkipLink
   │  ├─ bento/                    BentoGrid, BentoTile (size + color variants)
   │  ├─ motion/                   MotionProvider, Reveal, Stagger/StaggerItem, CountUp, DrawPath,
   │  │                            Draggable, FlipCard, Marquee, PageTransition, Tilt
   │  └─ sections/
   │     ├─ home/                  Hero, StatsRow, LabLife, EventsBento, ProjectsBento,
   │     │                         AnnouncementsList, JoinCta
   │     └─ shared/                PageHeader, EmptyState, CardGrid, FilterTabs …
   ├─ config/
   │  ├─ site.ts                   name, tagline, nav links, footer columns, socials, contact
   │  └─ features.ts               on/off switches for interactive extras (draggable stickers, etc.)
   ├─ content/mock/                typed mock data (events.ts, projects.ts, team.ts …)
   ├─ lib/
   │  ├─ data/                     getters: getEvents(), getProject(slug)…; source.ts = mock ⇄ API switch
   │  ├─ api/client.ts             fetch wrapper for ses-api (base URL, envelope unwrap, errors)
   │  ├─ motion/                   tokens.ts (durations/easings/springs), presets.ts (variants)
   │  ├─ utils.ts                  cn() = clsx + tailwind-merge, formatters
   │  └─ seo.ts                    buildMetadata() helper for titles/descriptions/Open Graph
   ├─ styles/
   │  ├─ tokens.css                ★ THE design file: palette, semantic colors, fonts, radii,
   │  │                              border width, shadows, easings, themes ([data-theme])
   │  ├─ fonts.ts                  next/font definitions → CSS variables used by tokens.css
   │  └─ globals.css               imports tailwind + tokens, base styles, custom @utility rules
   └─ types/content.ts             TS types mirroring docs/API-CONTRACT.md
```

## How to change the design (the whole point of this structure)

| Want to change… | Edit only… |
|---|---|
| Any color / the vibrant palette | `src/styles/tokens.css` (palette + semantic layer) |
| Fonts | `src/styles/fonts.ts` (+ font variables in `tokens.css`) |
| Border thickness, corner radius, hard-shadow offset, tilt | `src/styles/tokens.css` |
| Animation speed / feel | `src/lib/motion/tokens.ts` |
| A whole new look (e.g. a "minimal" theme) | add a `[data-theme="minimal"]` block in `tokens.css`, switch `data-theme` in `layout.tsx` |
| Turn an interactive extra on/off | `src/config/features.ts` |
| Nav links, footer, socials | `src/config/site.ts` |

Tailwind v4 keeps the theme in CSS (`@theme` in `tokens.css`) instead of `tailwind.config.js`.
If a change needs edits in many component files, the token layer is missing something — add the
token instead.

## Golden rules

1. **Design lives in tokens, never in components.** No hex codes, arbitrary values (`bg-[#…]`),
   `px` shadows or font names inside components. Tailwind's default palette is disabled on purpose.
2. **Components use semantic names** (`bg-surface`, `text-ink`, `bg-tile-yellow`, `shadow-brutal`).
   Colors are props (`<BentoTile color="mint">`) mapped once in `components/ui/variants.ts`.
3. **Server Components by default.** Only small interactive "islands" get `"use client"`.
   Pages and sections stay server-rendered for SEO (NFR-05) and speed (NFR-02).
4. **Animation is a first-class layer.** Use the shared wrappers in `src/components/motion/`; never
   hand-roll one-off animation code inside a section. Respect `prefers-reduced-motion`.
5. **Content is data.** Sections receive typed props; data comes only from `src/lib/data/*`
   (mocks now, ses-api later). Never hard-code event/project/team content in JSX.
6. **Accessibility** (WCAG 2.1 AA, NFR-03): semantic HTML, ordered headings, visible focus states,
   alt text, labels, keyboard support, text contrast ≥ 4.5:1. Decorations are `aria-hidden` and never
   cover text.
7. **Respect the scope** (`docs/REQUIREMENTS.md`): event registration is an **external link only**
   (O-02); **no member accounts / logins / portal** (O-03); no payments, blogs, comments,
   multi-language. Only the admin panel (FR-12) has login, and its auth is handled by ses-api.
8. **Placeholder content must look like placeholder content.** Never invent real-sounding stats,
   names, partners or achievements; mark placeholders `// TODO(content)`. Mock dates: late 2026+.

## Component rules

- Primitives use cva for variants (`variant`, `size`, `color`, `tilt`) and accept `className` via `cn()`.
- Images: `next/image` with real `alt` and `sizes`; only the hero/LCP image uses `priority`.
- External links (registration, GitHub, Discord): `target="_blank" rel="noopener noreferrer"`,
  external icon + sr-only "(opens in new tab)".
- Every page exports metadata via `buildMetadata()` (unique title + description).
- Mobile-first; check 360 / 768 / 1280 (NFR-01).

## Talking to ses-api

- `DATA_SOURCE=mock` (default) reads `src/content/mock`; `DATA_SOURCE=api` fetches `${API_URL}/api/public/...`
  through `src/lib/api/client.ts`.
- Use Next caching (`next: { revalidate, tags }`) so pages stay static-fast; server-side fetches use
  `API_URL`, browser-side calls (forms) use `NEXT_PUBLIC_API_URL`.
- Types in `src/types/content.ts` must match `docs/API-CONTRACT.md`. If you need a new field or
  endpoint, do not invent it silently: update the contract copy, the types and mocks, and list the
  backend change needed in ses-api in your summary.
- ses-api must allow this site's origin in `CORS_ORIGINS` (local: `http://localhost:3000`).

## Env (`.env.example`)

```
DATA_SOURCE=mock                       # mock | api
API_URL=http://localhost:4000          # server-side calls to ses-api
NEXT_PUBLIC_API_URL=http://localhost:4000   # browser-side calls (contact/join forms)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # canonical URLs, sitemap, Open Graph
```

## Workflow

- Small steps; after each run `npm run lint` and `npm run typecheck` (and `npm run build` when relevant).
- Before calling UI work done: run `npm run dev`, check 360/768/1280, keyboard-only, and with
  reduced motion emulated; compare with `docs/reference/`.
- Keep `docs/DESIGN.md` in sync when tokens change.
- Code is reviewed by a teammate before merge (NFR-08): focused diffs, clear names, short comments for
  non-obvious logic, conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
- Don't add dependencies without saying why.

## Commands

```
npm run dev         # http://localhost:3000
npm run lint
npm run typecheck   # tsc --noEmit
npm run format      # prettier
npm run build
```
