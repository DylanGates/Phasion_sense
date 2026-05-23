# Fastify BFF Backend Plan

## Goal

Create a `backend/` workspace package that proxies the hackathon API, normalizes merchant/catalog/team/campaign/basket data, centralizes fallback config, and generates WhatsApp checkout links.

## Backend Responsibilities

- Hide hackathon API base URL, merchant slug, team slug, and fallback WhatsApp config.
- Normalize API-relative image URLs into absolute URLs.
- Normalize empty merchant fields into frontend-safe fallback values.
- Proxy read endpoints for storefront, products, campaigns, team data, and health.
- Proxy write endpoints for campaigns and baskets.
- Generate WhatsApp checkout URL after a basket is created.

## Planned Routes

- `GET /health`
- `GET /api/storefront`
- `GET /api/merchant`
- `GET /api/products`
- `GET /api/campaigns`
- `GET /api/campaigns/:id`
- `GET /api/team`
- `POST /api/campaigns`
- `POST /api/baskets`

## Test Strategy

- Unit tests for merchant/product normalization.
- Unit tests for WhatsApp URL generation.
- Fastify injection tests for route behavior with a fake upstream client.

## Files

- `backend/package.json`
- `backend/tsconfig.json`
- `backend/vitest.config.ts`
- `backend/src/config.ts`
- `backend/src/types.ts`
- `backend/src/normalize.ts`
- `backend/src/whatsapp.ts`
- `backend/src/upstream.ts`
- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/src/__tests__/*.test.ts`
