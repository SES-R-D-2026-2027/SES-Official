# SES Website API Contract

Version 2 contract for the API hosted by the SES Cloudflare Worker.

## Conventions

- JSON responses use `{ data, meta? }` for success and `{ error: { code, message, details? } }` for errors.
- IDs are strings and slugs are URL-safe unique values.
- Public reads return published records only.
- All dates use ISO 8601 UTC values.
- Media binaries live in the private R2 bucket. D1 stores object keys, MIME types, dimensions, alt text and byte sizes.
- Admin writes must validate input, authenticate the caller, enforce role permissions, and invalidate affected public cache tags.

## Implemented

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Verifies that the Worker can query D1. |
| GET | `/media/[...key]` | Serves allowlisted public media objects from R2. |

## Planned public endpoints

| Method | Path | Returns |
|---|---|---|
| GET | `/api/public/home` | Featured events and projects, announcements and statistics |
| GET | `/api/public/events` | Published events with timeline and category filters |
| GET | `/api/public/events/:slug` | One event with its media gallery |
| GET | `/api/public/projects` | Published projects with technology and status filters |
| GET | `/api/public/projects/:slug` | One project with contributors and media |
| GET | `/api/public/departments` | Departments and their published team assignments |
| GET | `/api/public/team` | Published team members |
| GET | `/api/public/mentors` | Published mentors and contact links |
| GET | `/api/public/research` | Research initiatives and publications |
| GET | `/api/public/resources` | Published resources and categories |
| GET | `/api/public/announcements` | Published announcements |
| POST | `/api/public/contact` | Validated, rate-limited contact submission |
| POST | `/api/public/join` | Validated, rate-limited join submission |

## Planned admin endpoints

All admin routes require authenticated access and role authorization.

- `GET /api/admin/auth/me`
- `GET|POST /api/admin/:collection`
- `GET|PATCH|DELETE /api/admin/:collection/:id`
- `PATCH /api/admin/:collection/:id/status`
- `POST /api/admin/media`
- `GET /api/admin/submissions?type=contact|join`
- `GET /api/admin/activity`

Before an admin media upload writes to R2, it must reserve capacity through `src/lib/media/storage.ts`. A reservation is rejected when committed plus reserved storage would exceed 8 GB. The warning state begins at 5 GB.

The public content endpoints, admin authentication and admin CRUD routes are not implemented yet. The current pages continue to use Version 1 mock data until each public endpoint is connected and verified.
