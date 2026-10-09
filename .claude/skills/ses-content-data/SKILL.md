---
name: ses-content-data
description: How content flows into the SES website (types, mock data, data getters, mock-to-API switch). Use when adding a content type or field, writing mock data, creating a data getter, or connecting a page to the Express API.
---

# Content & data layer

Source of truth for shapes: `docs/API-CONTRACT.md`.

## Flow

```
docs/API-CONTRACT.md
        │ mirrored by
        ▼
src/types/content.ts ──► src/content/mock/*.ts   (typed sample data)
        │
        ▼
src/lib/data/<type>.ts   getUpcomingEvents(), getEvent(slug), getHome() …
        │   DATA_SOURCE=mock → read mocks (default)
        │   DATA_SOURCE=api  → fetch(`${API_URL}/api/public/...`) and unwrap { data }
        ▼
app/<route>/page.tsx  ──► sections (typed props)
```

## Rules

1. Components and pages import **only** from `@/lib/data/*` — never from `content/mock` or `fetch` directly.
2. Each getter has the same signature for both sources, is `async`, and returns typed data
   (`Promise<Event[]>`). Put the source switch in one helper (`lib/data/source.ts`) so getters stay tiny.
3. API fetches use Next caching: `fetch(url, { next: { revalidate: 300, tags: ["events"] } })` so pages
   stay static-fast (NFR-02) and can be revalidated later when admin edits content.
4. Derived values (event `timeline: upcoming|past`, sorted lists, featured picks) are computed in the
   getter so mock and API behave the same.
5. Validate API responses at the boundary in development (a light Zod schema or type guard) and fail
   with a clear error; never let `undefined` reach a component silently.
6. Mock data rules: realistic but obviously placeholder (`"Workshop Title — TODO"` is fine, invented
   partner companies or real people's names are not), dates in late 2026+, image paths under
   `/images/placeholder/*`, every optional field exercised at least once (missing image, no
   registration link, long title) so edge states get built.
7. Adding a field: update `docs/API-CONTRACT.md` → `types/content.ts` → mocks → getter → UI, and note
   in your summary that the backend model/validator needs the same change in the separate `ses-api` repo (open an issue/PR there, or tell the backend dev).

## Getter example

```ts
// src/lib/data/events.ts
import type { Event } from "@/types/content";
import { fromSource } from "./source";
import { events as mockEvents } from "@/content/mock/events";

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const all = await fromSource<Event[]>({ mock: () => mockEvents, api: "/api/public/events?timeline=upcoming", tags: ["events"] });
  const upcoming = all
    .filter((e) => new Date(e.startsAt) >= new Date())
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  return limit ? upcoming.slice(0, limit) : upcoming;
}
```
