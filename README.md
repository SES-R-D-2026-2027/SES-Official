# SES Official Website (ses-web)

Official website of the Software Engineering Society (SES), FAST-NUCES, maintained by the
Research & Development Department.

This repo is the **frontend only** (Next.js).
(Express + MongoDB); this site talks to it over HTTP and runs on typed mock data until it is ready.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Motion (`motion/react`) · cva + clsx + tailwind-merge · lucide-react · Zod.

## Getting started

Requirements: Node.js LTS (see `.nvmrc`; Next.js needs ≥ 20.9) and npm.

```bash
nvm use                 # optional, picks the Node version from .nvmrc
npm install
cp .env.example .env.local
npm run dev             # http://localhost:3000
```

### Environment

| Variable               | Default                 | Purpose                                                     |
| ---------------------- | ----------------------- | ----------------------------------------------------------- |
| `DATA_SOURCE`          | `mock`                  | `mock` reads `src/content/mock`, `api` fetches from ses-api |
| `API_URL`              | `http://localhost:4000` | server-side calls to ses-api                                |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:4000` | browser-side calls (contact/join forms)                     |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | canonical URLs, sitemap, Open Graph                         |

To use real data, start ses-api locally, set `DATA_SOURCE=api`, and make sure ses-api allows
`http://localhost:3000` in its `CORS_ORIGINS`.

## Scripts

```bash
npm run dev           # dev server
npm run lint          # ESLint
npm run typecheck     # generate route types + tsc --noEmit
npm run format        # Prettier (sorts Tailwind classes too)
npm run format:check  # Prettier without writing
npm run build         # production build
npm run start         # serve the production build
```

## Where things live

- `docs/DESIGN.md` is the design source of truth; `src/styles/tokens.css` implements it.
- `docs/REQUIREMENTS.md` lists the scope (FR/NFR); `docs/API-CONTRACT.md` the data shapes.
- `CLAUDE.md` describes the folder structure and the golden rules for contributors.

## Contributing

Small, focused PRs with conventional commits (`feat:`, `fix:`, `style:`, `chore:`). Run lint,
typecheck and build before opening a PR. Every PR is reviewed by a teammate (NFR-08).
