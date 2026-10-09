# SES — API Contract (ses-web ⇄ ses-api)

**Contract version: 1.0 · 2026-10-09**

Single source of truth for data shapes and endpoints between the two repos:

- **`ses-api`** (Express, JavaScript) — owns this contract. Its copy is the master.
- **`ses-web`** (Next.js, TypeScript) — keeps an identical copy in `docs/API-CONTRACT.md` and
  mirrors the shapes in `src/types/content.ts`.

How to change it: edit the master in `ses-api` (models + Zod validators + this file, bump the
version), then copy the file into `ses-web` in a matching PR and update `src/types/content.ts`.
If the two copies show different versions, stop and ask which one is correct.

Conventions: JSON, camelCase, ISO 8601 dates (UTC), `id` = string, `slug` = URL-safe unique.
All public content has `status` and the public API only returns `published` items.

## Shared pieces

```ts
type Status = "draft" | "published" | "archived";
type TileColor = "yellow" | "mint" | "lilac" | "coral" | "sky" | "blue" | "paper"; // optional accent per item
interface Media { url: string; alt: string; width?: number; height?: number; }
interface Link { label: string; url: string; }
interface Base { id: string; slug: string; status: Status; createdAt: string; updatedAt: string; }
```

## Content types

```ts
interface Department extends Base {          // FR-03
  name: string; shortDescription: string; description: string;
  responsibilities: string[]; headId?: string; memberIds: string[];
  color?: TileColor; icon?: string; order: number;
}

interface TeamMember extends Base {          // FR-04
  name: string; position: string; departmentId?: string;
  role: "leadership" | "head" | "member" | "advisor";
  photo?: Media; bio?: string; links: Link[]; funFact?: string; order: number;
}

interface Event extends Base {               // FR-05
  title: string; summary: string; description: string;
  category: "workshop" | "talk" | "hackathon" | "competition" | "meetup" | "other";
  startsAt: string; endsAt?: string;
  venue?: string; isOnline: boolean; onlineUrl?: string;
  registrationUrl?: string;                  // EXTERNAL link only (O-02)
  registrationLabel?: string;                // e.g. "Free admission · Food provided"
  badge?: string;                            // sticker text: "LIMITED SEATS", "OPEN REGISTRATION"
  coverImage?: Media; gallery: Media[];
  isFeatured: boolean; color?: TileColor;
  // derived on read: timeline: "upcoming" | "past"
}

interface Project extends Base {             // FR-06
  name: string; tagline: string; description: string;
  projectStatus: "idea" | "in-progress" | "shipped" | "maintained";
  technologies: string[]; techAreaIds: string[];
  contributorIds: string[]; departmentId?: string; initiativeId?: string;
  repoUrl?: string; liveUrl?: string; docsUrl?: string; stars?: number;
  coverImage?: Media; gallery: Media[];
  isFeatured: boolean; lookingForContributors: boolean; color?: TileColor;
}

interface ResearchInitiative extends Base {  // FR-07
  title: string; summary: string; description: string;
  memberIds: string[]; projectIds: string[];
  publications: { title: string; authors: string[]; year: number; url?: string; file?: Media }[];
}

interface TechArea extends Base {            // FR-08
  name: string; description: string; icon?: string; color?: TileColor; order: number;
}

interface Resource extends Base {            // FR-09
  title: string; description: string; categoryId: string;
  type: "file" | "link" | "video" | "doc";
  url?: string; file?: { url: string; name: string; sizeBytes: number; mime: string };
  techAreaIds: string[];
}
interface ResourceCategory extends Base { name: string; order: number; }

interface Announcement extends Base {        // FR-10
  title: string; summary: string; body: string;    // body = markdown
  category: "news" | "research" | "partnership" | "community" | "notice";
  publishedAt: string; isPinned: boolean;
}

interface SiteStats {                        // homepage stats row (admin-editable)
  items: { value: number; suffix?: string; label: string; description: string; note?: string; color: TileColor }[];
}

// FR-11 submissions (write-only from public site)
interface ContactSubmission { name: string; email: string; subject: string; message: string; }
interface JoinSubmission {
  name: string; email: string; rollNumber?: string; batch?: string;
  interests: string[]; experience?: string; message?: string;
}
```

## Endpoints

Envelope: success `{ data, meta? }` · error `{ error: { code, message, details? } }`.

### Public (read-only, no auth)

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | `{ data: { ok: true } }` |
| GET | `/api/public/home` | `{ featuredEvents, featuredProjects, latestAnnouncements, stats }` |
| GET | `/api/public/events?timeline=upcoming\|past&category=&page=&limit=` | `Event[]` + `meta.pagination` |
| GET | `/api/public/events/:slug` | `Event` |
| GET | `/api/public/projects?tech=&status=&page=` | `Project[]` |
| GET | `/api/public/projects/:slug` | `Project` (+ contributors expanded) |
| GET | `/api/public/departments` · `/:slug` | `Department[]` · `Department` (+ head, members) |
| GET | `/api/public/team?role=&department=` | `TeamMember[]` |
| GET | `/api/public/research` · `/:slug` | `ResearchInitiative[]` · one |
| GET | `/api/public/tech-areas` | `TechArea[]` |
| GET | `/api/public/resources?category=&tech=` | `Resource[]` + categories |
| GET | `/api/public/announcements?page=` · `/:slug` | `Announcement[]` · one |
| POST | `/api/public/contact` | `201` (rate-limited, validated) |
| POST | `/api/public/join` | `201` (rate-limited, validated) |

### Admin (FR-12, later phase — auth cookie + role required)

`POST /api/admin/auth/login|logout`, `GET /api/admin/auth/me`,
`GET|POST /api/admin/:collection`, `GET|PATCH|DELETE /api/admin/:collection/:id`,
`PATCH /api/admin/:collection/:id/status`, `POST /api/admin/media` (upload, type/size validated),
`GET /api/admin/submissions?type=contact|join`, `GET /api/admin/submissions/export.csv`,
`GET|POST|PATCH /api/admin/users` (super-admin), `GET /api/admin/activity`.
