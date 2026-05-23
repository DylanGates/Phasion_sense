# Phasion Sense

Hackathon storefront and merchant campaign command center for the Coded Matrix Tech AI Fashion Retail Hackathon.

Phasion Sense helps a fashion merchant turn a live product catalog into shoppable campaigns, collect baskets, and hand off orders to WhatsApp.

## Project Status

This repo is now organized as a monorepo. The existing generated Next.js dashboard has been moved into [frontend](./frontend), and the active plan is to replace that generic project-management UI with the Phasion Sense commerce flow described in [plan.md](./plan.md).

## Correct Hackathon API Identity

The original planning docs referenced `Amina Stitches` and `amina-stitches`. That is not the correct merchant for this project.

Use:

- Merchant name: `Phasion Sense`
- Merchant id/slug: `phasion-sense`
- API base: `https://api-hackathon.codedematrixtech.com`
- Team name: `Phasion Sense`
- Team slug: decide before registration; recommended default is `phasion-sense` if still available.

## Live API Findings

Tested on 2026-05-23:

- `GET /health` returns API, database, upload, and asset health as `ok`.
- `GET /merchants` includes `phasion-sense`.
- `GET /merchants/phasion-sense` returns:
  - `id`: `phasion-sense`
  - `name`: `Phasion Sense`
  - empty `description`
  - logo path `/images/phasion-sense/logo.png`
  - empty `brand_colors`
  - empty `whatsapp_number`
- `GET /merchants/phasion-sense/items` returns 15 in-stock products.
- `GET /merchants/phasion-sense/campaigns` returns an empty list.
- `GET /teams` shows an existing Phasion Sense team slug `a5`; do not assume it belongs to this project.

## Core Routes

- `/` storefront landing page
- `/catalog` product listing and basket entry
- `/campaigns` campaign list
- `/campaigns/[id]` customer-facing campaign page
- `/studio` campaign builder
- `/checkout` basket review and WhatsApp handoff
- `/dashboard` merchant command center

## Monorepo Layout

```txt
Phasion_sense/
├── backend/               # Fastify BFF/API proxy
├── frontend/              # Next.js app
├── docs/                  # Project-specific API findings
├── plan.md                # Implementation plan
├── package.json           # Workspace scripts
├── pnpm-workspace.yaml    # pnpm workspace config
└── pnpm-lock.yaml         # Workspace lockfile
```

## API Endpoints Used

- `GET /health`
- `GET /merchants`
- `GET /merchants/{slug}`
- `GET /merchants/{slug}/items`
- `GET /merchants/{slug}/campaigns?team_slug={teamSlug}`
- `POST /campaigns`
- `GET /campaigns/{campaignId}`
- `POST /baskets`
- `GET /baskets/{basketId}`
- `GET /teams`
- `POST /teams`
- `GET /teams/{teamSlug}`
- `POST /uploads`
- `POST /uploads/rehost`

## Backend BFF

The backend is a Fastify service in `backend/`. It proxies the hackathon API, normalizes frontend-facing payloads, applies the Phasion Sense fallback WhatsApp number, and generates checkout deep links.

For Vercel, the Fastify app is served through Next route handlers in `frontend/src/app/api/[...path]/route.ts`, so the frontend and backend deploy together on one Vercel project.

Backend routes:

- `GET /health`
- `GET /api/storefront`
- `GET /api/merchant`
- `GET /api/products`
- `GET /api/campaigns`
- `GET /api/campaigns/:id`
- `GET /api/team`
- `POST /api/campaigns`
- `POST /api/baskets`

## Environment

Create `.env.local` when implementation begins:

```bash
NEXT_PUBLIC_API_BASE=https://api-hackathon.codedematrixtech.com
NEXT_PUBLIC_MERCHANT_SLUG=phasion-sense
NEXT_PUBLIC_TEAM_SLUG=phasion-sense
NEXT_PUBLIC_FALLBACK_WHATSAPP=+233595352458
```

`NEXT_PUBLIC_FALLBACK_WHATSAPP` is required because the Phasion Sense merchant currently has an empty `whatsapp_number` in the API.

Backend environment:

```bash
HACKATHON_API_BASE=https://api-hackathon.codedematrixtech.com
MERCHANT_SLUG=phasion-sense
TEAM_SLUG=phasion-sense
FALLBACK_WHATSAPP=+233595352458
PORT=4000
```

## Development

```bash
pnpm install
pnpm dev
```

From the monorepo root, `pnpm dev` runs the `frontend` app at `http://localhost:3000`.

Run the backend:

```bash
pnpm dev:backend
```

The backend runs at `http://localhost:4000`.

## Build

```bash
pnpm build
pnpm start
```

## Vercel Deployment

Deploy this repository as a single Vercel project from the monorepo root:

- Framework preset: `Next.js`
- Install command: `pnpm install`
- Build command: `pnpm build`
- Output directory: `frontend/.next`

These settings are also captured in [vercel.json](./vercel.json).

Set these environment variables in Vercel:

```bash
HACKATHON_API_BASE=https://api-hackathon.codedematrixtech.com
MERCHANT_SLUG=phasion-sense
TEAM_SLUG=phasion-sense
FALLBACK_WHATSAPP=+233595352458
```

Backend checks:

```bash
pnpm test
pnpm build:backend
```

## Implementation Plan

See [plan.md](./plan.md) for the task-by-task implementation plan.
