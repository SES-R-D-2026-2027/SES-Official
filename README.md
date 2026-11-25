# SES — Software Engineering Society

Official website for the Software Engineering Society (SES) at FAST-NUCES, Islamabad.

The site presents society information, events, projects, research, mentors, the current team structure, department pages, resources and partnership enquiries.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Motion for React
- Lucide React icons

## Requirements

- Node.js 20.9 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Validation and production

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

`npm run build` creates the production build in `.next/`. Generated output and dependencies are intentionally excluded from Git.

## Environment variables

Copy `.env.example` to `.env.local` when environment configuration is required. Never commit real credentials or private API keys.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public website URL used by metadata and SEO |
| `DATA_SOURCE` | `mock` (default) or `api` to use the SES API |
| `API_URL` | Optional server-side SES API base URL |
| `NEXT_PUBLIC_API_URL` | Optional browser-side SES API base URL |

If no API is configured, the application uses the local content modules under `src/content/mock/`.

## Project structure

```text
src/
├── app/                    # App Router pages and route handlers
│   ├── about/              # Society overview
│   ├── departments/[slug]/ # Dedicated page for each department
│   ├── events/             # Events index and detail pages
│   ├── projects/           # Project catalogue
│   ├── resources/          # Sponsors, partners and published metrics
│   └── team/               # Society leadership and department directory
├── components/
│   ├── layout/             # Header, navigation, footer and theme controls
│   ├── motion/             # Reusable motion and draggable interactions
│   ├── sections/           # Page sections grouped by feature
│   └── ui/                 # Shared UI primitives
├── config/                 # Site-wide configuration and feature flags
├── content/mock/           # Local fallback content
├── lib/data/               # Data access and derived summaries
├── styles/                 # Global styles and design tokens
└── types/                  # Shared TypeScript contracts

public/
├── brand/                  # Light/dark society logos and favicons
├── images/                 # Event, project and team imagery
└── stickers/               # Decorative assets
```

## Updating society content

- **Departments and team structure:** `src/content/mock/departments.ts` and `src/content/mock/team.ts`.
- **Projects:** `src/content/mock/projects.ts`. Use `idea`, `in-progress`, `shipped` or `maintained` as the project status.
- **Events:** `src/content/mock/events.ts`.
- **Mentors:** `src/content/mock/mentors.ts`. Publish only verified mentor names, roles, biographies and contact links.
- **Homepage copy:** `src/content/home.ts`.
- **Navigation, social links and contact details:** `src/config/site.ts`.
- **Brand assets:** `public/brand/`. Keep light and dark artwork paired and test both themes.

For a new department, add its record and member IDs to the content data. Its detail route is generated from `/departments/[slug]`.

## Analytics and reporting policy

The Resources page derives department, team and project figures from the current website content. It does not present directory counts as total society membership. Completed projects are those marked `shipped` or `maintained`.

Website traffic metrics (visitors, sessions, page views and engagement) are not available until an analytics provider is configured. Mentor counts and sponsor names must be based on a confirmed roster or approved partnership record. Do not add estimates as official figures.

## Git hygiene

`.gitignore` excludes dependencies, build output, local environment files, caches, logs and generated handoff archives. Keep source files, lockfiles, documentation and intentional assets under `public/` tracked. In particular, do not ignore all `*.zip` files: some ZIPs under `public/` may be intentional downloadable resources.

If generated directories were already committed, remove them from the Git index (without deleting local copies) using:

```bash
git rm -r --cached --ignore-unmatch node_modules .next out build coverage .turbo .vercel .cache
```

Remove the generated handoff ZIP from tracking if it was committed:

```bash
git rm --cached --ignore-unmatch ses-web-src-finalized.zip ses-web-src-fixed.zip ses-web-src.zip
```

Then review and commit:

```bash
git add .gitignore README.md
git add -A
 git status --short
 git commit -m "chore: clean repository and update SES pages"
```

If a large file is already present in previous Git history, `.gitignore` and `git rm --cached` will stop future tracking but will not shrink the existing remote history. History rewriting or Git LFS may be needed for that separate case.

## Public references used for society overview

- SES public organization profile and updates: <https://pk.linkedin.com/company/nuses>
- FAST-NUCES Islamabad official website: <https://isb.nu.edu.pk/>

Public profile details and event highlights should be reviewed periodically. Internal roster, project status, sponsor approvals and mentor details should be maintained by the current society team.
