# SES Official Website

Official website for the Software Engineering Society (SES), FAST-NUCES Islamabad.

The site presents society information, departments, team members, events, projects, research, mentors and resources. Version 2 introduces the Cloudflare data and media foundation while preserving the Version 1 interface.

## Stack

- Next.js App Router with Vinext and Vite
- React 19 and TypeScript
- Tailwind CSS 4
- Motion for React and Lucide React
- Cloudflare Workers
- Cloudflare D1 for structured content and submissions
- Cloudflare R2 for images and downloadable media
- Cloudflare KV for the Vinext data cache

## Requirements

- Node.js 20.9 or newer
- npm
- Cloudflare account with the SES D1 database and R2 bucket configured

## Local development

Install dependencies:

```bash
npm install
```

Generate Cloudflare binding types and type-check:

```bash
npm run typecheck
```

Run the Vinext development server:

```bash
npm run dev:vinext
```

Open <http://localhost:3001>. On the Team page, card placements use a new asymmetric default layout; saved positions from the earlier layout are intentionally ignored. The homepage featured-card progress and cycle interval is 3 seconds.

Build and preview the production bundle:

```bash
npm run build:vinext
npm run start:vinext
```

The `next` scripts remain available for compatibility, but the Cloudflare development and production path uses the `*:vinext` scripts.

## Cloudflare resources

The Worker bindings are defined in `cloudflare.config.ts`:

| Binding | Resource | Purpose |
| --- | --- | --- |
| `DB` | `ses-official-db` | Structured site content, media metadata, submissions and storage reservations |
| `MEDIA` | `ses-official-media` | Private R2 object storage for public site media |
| `VINEXT_KV_CACHE` | Cloudflare KV | Vinext data cache |
| `ASSETS` | Worker assets | Built static assets |

The D1 migrations are ordered and version-controlled in `migrations/`. The initial content schema is `0001_initial_ses_content_schema.sql`. `0002_media_storage_guardrails.sql` adds storage accounting and atomic upload reservations. `0003_seed_v1_media.sql` registers the Version 1 media objects after they have been uploaded to R2.

The Version 1 media seed migration must be applied only after its corresponding R2 objects exist. The safe local sequence is:

```bash
npm run media:upload:local
npx cf d1 migrations apply db493d58-f656-4b8e-b776-edd9e5f4b1ed --local
```

The remote sequence is:

```bash
npx --yes wrangler@4 login
npm run media:upload:remote -- --confirm
npx cf d1 migrations apply db493d58-f656-4b8e-b776-edd9e5f4b1ed
```

The current `/api/health` endpoint verifies the Worker-to-D1 connection. The other public content endpoints and the admin portal are future Version 2 tasks. The existing public pages still use the local mock content until those endpoints are implemented and the data is migrated.

## R2 media

The R2 bucket is private. The Worker serves only the approved public media key prefixes through `/media/[...key]`; the bucket itself is not exposed through `r2.dev`. `next.config.ts` disables the Next image optimizer so browser requests go directly to the Worker media route.

The repository does not contain the site's photo library. The local `public/` migration staging folder is intentionally excluded and ignored by Git. The R2 manifest records the 37 Version 1 media objects that were migrated (12,400,382 bytes in total). The corresponding production `media_assets` records and storage-accounting state were seeded after all 37 remote uploads succeeded. Duplicate portraits, unused event photos, old `public/team/` copies and the unused Canva ZIP were excluded.

The bulk uploader is a one-time migration utility. It expects the original source images under `public/`; those files must be restored from a separate backup before reusing it. The final source archive intentionally does not package those files.

Local D1 migrations (through `cf`), local R2 objects (through Wrangler) and the Vite development Worker share `.cloudflare/state/v3`. The standard development command uses the local R2 simulation:

```bash
npm run dev:vinext
```

To run the Worker locally while reading the production R2 bucket (read operations only), use the dedicated mode:

```bash
npm run dev:vinext -- --mode remote-media
```

This mode keeps D1 and KV locally simulated and makes only the R2 binding remote. Remote object reads consume the account's R2 Class B allowance. Do not use this mode for upload tests.

The one-time uploader uses Wrangler and requires `npx --yes wrangler@4 login` for remote writes (separate from `cf auth login`). Its remote command requires an explicit `--confirm` flag. It checks the media manifest and source file sizes, refuses a batch over 8 GB, and reads one object back after uploading. It does not delete source files. The original media staging files are not included in this repository or this source archive.

## Storage safety rules

The D1 storage guard records committed media bytes and in-flight upload reservations. Production is currently seeded with 12,400,382 committed bytes and zero reserved bytes. The application thresholds are:

- 5 GB committed plus reserved: warning state.
- 8 GB committed plus reserved: reject new upload reservations.

`src/lib/media/storage.ts` contains the atomic reservation, completion and release helpers. They are database primitives, not a complete upload API: the admin authentication, upload endpoint, notification delivery and UI enforcement are not implemented yet. Any future admin upload endpoint must call these helpers before writing to R2.

These application controls apply only to uploads routed through the future Worker API. They do not prevent direct writes through the Cloudflare Dashboard, Wrangler or other tools. Keep the R2 bucket dedicated to SES and monitor account usage in Cloudflare's R2 Metrics and billing dashboard.

## Source structure

```text
src/
├── app/                    # App Router pages and API/media route handlers
├── components/             # Layout, UI, motion and page sections
├── config/                 # Site-wide configuration
├── content/mock/           # Version 1 fallback content
├── lib/api/                # API client
├── lib/data/               # Data access and derived summaries
├── lib/media/              # R2 storage quota and reservation helpers
├── styles/                 # Global CSS and design tokens
└── types/                  # Shared TypeScript contracts

migrations/                 # Versioned D1 schema and seed migrations
scripts/                    # Controlled R2 media migration tooling
```

## Git hygiene

Generated output, dependencies, local Cloudflare state, credentials, screenshots, design/reference planning documents and the local `public/` media staging directory are ignored. Keep application source, lockfiles, SQL migrations, API contract and this README in Git.

After R2 media has been uploaded and the local site verified, untrack previously committed generated files and media without deleting the local copies:

```bash
git rm -r --cached --ignore-unmatch node_modules .next .next-dev out dist build .vinext .vite .turbo .vercel .cache coverage test-results playwright-report .cloudflare .wrangler public docs/reference docs/DESIGN.md docs/REQUIREMENTS.md

git rm --cached --ignore-unmatch next-env.d.ts tsconfig.tsbuildinfo
```

Then review and stage the cleanup:

```bash
git add -A
git status --short
```

The ignore rules prevent these paths from being re-added by a later `git add -A`. `git rm --cached` removes tracked copies from the next commit but leaves the local files in place. Once the R2 upload and tests have passed, delete the local media staging files if desired:

```bash
rm -rf public
```

Review `git status --short` before committing. Do not push until the local media route, page images and production build have been tested.

Feel free to reach out to ik-awais