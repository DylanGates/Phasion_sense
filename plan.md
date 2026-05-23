# Phasion Sense Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hackathon-ready campaign command center and storefront for the `phasion-sense` merchant.

**Architecture:** Replace the current generic project dashboard surface with a focused Next.js App Router product. Use the hackathon API as the source of truth for merchant, products, campaigns, baskets, uploads, and teams, with small client-side stores for basket and campaign draft state.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, existing shadcn/Radix UI primitives, lucide-react, sonner, Vercel.

---

## Confirmed API Facts

- API base: `https://api-hackathon.codedematrixtech.com`
- Health: `GET /health` returns `{"status":"ok","db":"ok","uploads":"ok","assets":"ok"}`
- Correct merchant id/slug: `phasion-sense`
- Merchant detail: name is `Phasion Sense`, description is empty, brand colors are empty, WhatsApp number is empty.
- Product catalog: `GET /merchants/phasion-sense/items` returns 15 in-stock products.
- Product ids: `ps-1` through `ps-15`.
- Prices: Shirts are `25000` minor units, two-piece items are `55000` minor units, currency is `GHS`.
- Existing campaigns: `GET /merchants/phasion-sense/campaigns` returns an empty list.
- Existing team for Phasion Sense: `a5`, name `kephastetteh`; do not assume this is our team.

## Route Plan

- `/` public storefront landing page with featured products, campaign CTA, and basket entry.
- `/dashboard` merchant command center with campaign/order metrics and quick actions.
- `/studio` campaign builder with editor, featured product selector, draft persistence, and live preview.
- `/catalog` complete products listing page with search, product grid, stock status, and basket actions.
- `/campaigns` published campaign list.
- `/campaigns/[id]` customer-facing campaign landing page.
- `/checkout` basket review and WhatsApp handoff.

## File Structure

- Modify `frontend/src/app/layout.tsx`: Phasion Sense metadata, viewport theme, app shell defaults.
- Replace `frontend/src/app/page.tsx`: storefront landing page.
- Create `frontend/src/app/dashboard/page.tsx`: merchant dashboard route.
- Create `frontend/src/app/studio/page.tsx`: campaign builder route.
- Create `frontend/src/app/catalog/page.tsx`: product listing route.
- Create `frontend/src/app/campaigns/page.tsx`: campaign list route.
- Create `frontend/src/app/campaigns/[id]/page.tsx`: campaign detail route.
- Create `frontend/src/app/checkout/page.tsx`: checkout route.
- Create `frontend/src/components/phasion/app-shell.tsx`: top navigation, mobile navigation, basket count.
- Create `frontend/src/components/phasion/product-card.tsx`: product display and add-to-basket action.
- Create `frontend/src/components/phasion/product-grid.tsx`: searchable product grid.
- Create `frontend/src/components/phasion/basket-drawer.tsx`: global basket review surface.
- Create `frontend/src/components/phasion/campaign-studio.tsx`: client form and live preview.
- Create `frontend/src/components/phasion/campaign-card.tsx`: summary card for campaign lists.
- Create `frontend/src/components/phasion/checkout-form.tsx`: basket submission and WhatsApp link generation.
- Create `frontend/src/lib/phasion/api.ts`: typed fetch wrapper and endpoint methods.
- Create `frontend/src/lib/phasion/types.ts`: API response and request types.
- Create `frontend/src/lib/phasion/config.ts`: API base, merchant slug, team slug, WhatsApp fallback.
- Create `frontend/src/lib/phasion/format.ts`: image URL and money format helpers.
- Create `frontend/src/lib/phasion/mock-data.ts`: development fallbacks for merchant and catalog.
- Create `frontend/src/lib/phasion/basket-store.ts`: persisted client basket store.
- Modify `frontend/src/app/globals.css`: replace blue project-dashboard theme with Phasion Sense brand tokens.
- Modify `README.md`: update project identity, API facts, setup, and route overview.

---

## Task 1: API Types and Client

**Files:**
- Create: `frontend/src/lib/phasion/types.ts`
- Create: `frontend/src/lib/phasion/config.ts`
- Create: `frontend/src/lib/phasion/format.ts`
- Create: `frontend/src/lib/phasion/mock-data.ts`
- Create: `frontend/src/lib/phasion/api.ts`

- [ ] **Step 1: Create API types**

```ts
export interface MerchantListItem {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  whatsapp_number: string | null
}

export interface MerchantDetail extends MerchantListItem {
  brand_colors: string[] | null
}

export interface ItemResponse {
  id: string
  merchant_id: string
  name: string
  description: string | null
  price_minor: number
  currency: string
  image_urls: string[] | null
  in_stock: boolean
}

export interface CampaignSummary {
  id: string
  title: string
  copy_text: string | null
  image_urls: string[] | null
  team_slug: string | null
  created_at: number
}

export interface CampaignFeaturedItem {
  id: string
  name: string
  price_minor: number
  currency: string
  image_url: string | null
  in_stock: boolean
}

export interface CampaignDetail extends CampaignSummary {
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  featured_items: CampaignFeaturedItem[]
}

export interface CampaignCreateRequest {
  merchant_id: string
  title: string
  copy_text?: string | null
  image_urls?: string[] | null
  featured_item_ids?: string[] | null
  team_slug?: string | null
}

export interface BasketItemInput {
  item_id: string
  qty: number
  item_note?: string | null
}

export interface BasketCreateRequest {
  merchant_id: string
  items: BasketItemInput[]
  customer_name?: string | null
  customer_phone?: string | null
  customer_note?: string | null
  team_slug?: string | null
}

export interface BasketDetail {
  id: string
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  items: Array<{
    item_id: string
    name: string
    price_minor: number
    currency: string
    image_url: string | null
    in_stock: boolean
    qty: number
    item_note: string | null
  }>
  total_minor: number
  currency: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_note: string | null
  team_slug: string | null
  created_at: number
}

export interface TeamDetail {
  slug: string
  name: string | null
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  contact: string | null
  registered: boolean
  baskets: Array<{ id: string; merchant_id: string; total_minor: number; currency: string | null; created_at: number }>
  campaigns: Array<{ id: string; merchant_id: string; title: string; created_at: number }>
  created_at: number | null
}
```

- [ ] **Step 2: Create config**

```ts
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "https://api-hackathon.codedematrixtech.com"

export const MERCHANT_SLUG =
  process.env.NEXT_PUBLIC_MERCHANT_SLUG ?? "phasion-sense"

export const TEAM_SLUG =
  process.env.NEXT_PUBLIC_TEAM_SLUG ?? "phasion-sense"

export const FALLBACK_WHATSAPP =
  process.env.NEXT_PUBLIC_FALLBACK_WHATSAPP ?? "+233595352458"

export const PHASION_BRAND = {
  name: "Phasion Sense",
  tagline: "Campaign-ready fashion commerce for curated drops.",
  primary: "#111827",
  accent: "#C8A45D",
  surface: "#FAF7F2",
}
```

- [ ] **Step 3: Create format helpers**

```ts
import { API_BASE } from "./config"

export function formatMoney(priceMinor: number, currency = "GHS") {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
  }).format(priceMinor / 100)
}

export function assetUrl(path: string | null | undefined) {
  if (!path) return "/placeholder.jpg"
  if (path.startsWith("http")) return path
  return `${API_BASE}${path}`
}

export function cleanWhatsAppNumber(phone: string) {
  return phone.replace(/\D/g, "")
}
```

- [ ] **Step 4: Create API client**

```ts
import { API_BASE, MERCHANT_SLUG, TEAM_SLUG } from "./config"
import type {
  BasketCreateRequest,
  BasketDetail,
  CampaignCreateRequest,
  CampaignDetail,
  CampaignSummary,
  ItemResponse,
  MerchantDetail,
  MerchantListItem,
  TeamDetail,
} from "./types"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: init?.method ? undefined : { revalidate: 30 },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? body?.error ?? `API request failed: ${response.status}`)
  }

  return response.json()
}

export const phasionApi = {
  listMerchants: () => request<MerchantListItem[]>("/merchants"),
  getMerchant: (slug = MERCHANT_SLUG) => request<MerchantDetail>(`/merchants/${slug}`),
  getItems: (slug = MERCHANT_SLUG) => request<ItemResponse[]>(`/merchants/${slug}/items`),
  getCampaigns: (slug = MERCHANT_SLUG, teamSlug = TEAM_SLUG) =>
    request<CampaignSummary[]>(`/merchants/${slug}/campaigns?team_slug=${teamSlug}`),
  getCampaign: (id: string) => request<CampaignDetail>(`/campaigns/${id}`),
  createCampaign: (data: CampaignCreateRequest) =>
    request<{ id: string }>("/campaigns", { method: "POST", body: JSON.stringify(data) }),
  createBasket: (data: BasketCreateRequest) =>
    request<{ id: string }>("/baskets", { method: "POST", body: JSON.stringify(data) }),
  getBasket: (id: string) => request<BasketDetail>(`/baskets/${id}`),
  getTeam: (slug = TEAM_SLUG) => request<TeamDetail>(`/teams/${slug}`),
}
```

- [ ] **Step 5: Verify types compile**

Run: `pnpm build`

Expected: TypeScript either passes or reports only errors from routes not yet updated. Fix import/path mistakes before moving on.

---

## Task 2: Basket Store

**Files:**
- Create: `frontend/src/lib/phasion/basket-store.ts`

- [ ] **Step 1: Implement a persisted basket store**

```ts
"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ItemResponse } from "./types"

export interface BasketLine {
  item: ItemResponse
  qty: number
  note?: string
}

interface BasketState {
  lines: BasketLine[]
  isOpen: boolean
  openBasket: () => void
  closeBasket: () => void
  addItem: (item: ItemResponse, qty?: number) => void
  removeItem: (itemId: string) => void
  updateQty: (itemId: string, qty: number) => void
  clearBasket: () => void
  totalMinor: () => number
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      openBasket: () => set({ isOpen: true }),
      closeBasket: () => set({ isOpen: false }),
      addItem: (item, qty = 1) =>
        set((state) => {
          if (!item.in_stock) return state
          const existing = state.lines.find((line) => line.item.id === item.id)
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((line) =>
                line.item.id === item.id ? { ...line, qty: line.qty + qty } : line,
              ),
            }
          }
          return { isOpen: true, lines: [...state.lines, { item, qty }] }
        }),
      removeItem: (itemId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.item.id !== itemId) })),
      updateQty: (itemId, qty) => {
        if (qty <= 0) {
          get().removeItem(itemId)
          return
        }
        set((state) => ({
          lines: state.lines.map((line) => (line.item.id === itemId ? { ...line, qty } : line)),
        }))
      },
      clearBasket: () => set({ lines: [], isOpen: false }),
      totalMinor: () => get().lines.reduce((total, line) => total + line.item.price_minor * line.qty, 0),
    }),
    { name: "phasion-sense-basket" },
  ),
)
```

- [ ] **Step 2: Build-check the store**

Run: `pnpm build`

Expected: no store-related TypeScript errors.

---

## Task 3: App Shell and Global Theme

**Files:**
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/globals.css`
- Create: `frontend/src/components/phasion/app-shell.tsx`

- [ ] **Step 1: Update metadata**

Set title to `Phasion Sense` and description to `Campaign command center and storefront for Phasion Sense.`

- [ ] **Step 2: Replace theme variables**

Use a restrained fashion commerce palette:

```css
:root {
  --background: oklch(0.985 0.008 83);
  --foreground: oklch(0.145 0.015 255);
  --primary: oklch(0.22 0.018 255);
  --accent: oklch(0.72 0.11 78);
  --muted: oklch(0.94 0.012 83);
  --border: oklch(0.88 0.012 83);
  --radius: 0.5rem;
}
```

- [ ] **Step 3: Create app shell**

The shell includes navigation links to Storefront, Catalog, Campaigns, Studio, Dashboard, and Checkout. It also renders a basket button with the current line count.

- [ ] **Step 4: Verify navigation renders**

Run: `pnpm dev`, open `http://localhost:3000`, and confirm no hydration errors in the terminal.

---

## Task 4: Storefront Landing Page and Catalog

**Files:**
- Replace: `frontend/src/app/page.tsx`
- Create: `frontend/src/app/catalog/page.tsx`
- Create: `frontend/src/components/phasion/product-card.tsx`
- Create: `frontend/src/components/phasion/product-grid.tsx`

- [ ] **Step 1: Build product card**

Product card accepts an `ItemResponse`, uses `assetUrl`, displays image, name, `formatMoney`, stock badge, and Add button.

- [ ] **Step 2: Build catalog grid**

Catalog grid supports client-side search by product name and shows all products from `GET /merchants/phasion-sense/items`.

- [ ] **Step 3: Build landing page**

Landing page fetches merchant and products server-side. First viewport shows Phasion Sense, the current edit, 4 featured products, and CTAs to `/catalog` and `/studio`.

- [ ] **Step 4: Verify**

Run: `pnpm build`.

Expected: `/` and `/catalog` compile and render product images from API-relative URLs.

---

## Task 5: Campaign Studio and Campaign Pages

**Files:**
- Create: `frontend/src/app/studio/page.tsx`
- Create: `frontend/src/app/campaigns/page.tsx`
- Create: `frontend/src/app/campaigns/[id]/page.tsx`
- Create: `frontend/src/components/phasion/campaign-studio.tsx`
- Create: `frontend/src/components/phasion/campaign-card.tsx`

- [ ] **Step 1: Create campaign list**

Fetch `GET /merchants/phasion-sense/campaigns?team_slug=<team>` and show an empty state if no campaigns exist.

- [ ] **Step 2: Create studio form**

Fields: title, copy text, image URL, featured product ids. Save drafts in `localStorage` under `phasion-sense-campaign-draft`.

- [ ] **Step 3: Publish campaign**

POST to `/campaigns` with:

```json
{
  "merchant_id": "phasion-sense",
  "title": "Weekend Shirt Edit",
  "copy_text": "A tight edit of easy shirts and two-piece sets from Phasion Sense.",
  "image_urls": ["/images/phasion-sense/ps1.jpg"],
  "featured_item_ids": ["ps-1", "ps-2", "ps-12"],
  "team_slug": "phasion-sense"
}
```

- [ ] **Step 4: Create campaign detail page**

Fetch `GET /campaigns/{id}` and render hero, copy, featured products, and Add to Basket buttons.

- [ ] **Step 5: Verify**

Create one test campaign only after the team slug is registered. Confirm it appears on `/campaigns`.

---

## Task 6: Checkout and WhatsApp Handoff

**Files:**
- Create: `frontend/src/app/checkout/page.tsx`
- Create: `frontend/src/components/phasion/checkout-form.tsx`

- [ ] **Step 1: Build review UI**

Show basket lines, quantity controls, subtotal, and customer name/phone/note fields.

- [ ] **Step 2: POST basket**

Submit:

```ts
{
  merchant_id: "phasion-sense",
  items: lines.map((line) => ({ item_id: line.item.id, qty: line.qty, item_note: line.note ?? null })),
  customer_name: customerName || null,
  customer_phone: customerPhone || null,
  customer_note: customerNote || null,
  team_slug: TEAM_SLUG,
}
```

- [ ] **Step 3: Generate WhatsApp link**

Use merchant WhatsApp if present, otherwise `NEXT_PUBLIC_FALLBACK_WHATSAPP`.

- [ ] **Step 4: Verify**

Add one product to basket, submit checkout, confirm API returns a basket id, and confirm the WhatsApp URL contains item names, quantities, total, and basket id.

---

## Task 7: Dashboard

**Files:**
- Create: `frontend/src/app/dashboard/page.tsx`

- [ ] **Step 1: Fetch team data**

Use `GET /teams/{TEAM_SLUG}`. If unregistered, show setup instructions instead of blank metrics.

- [ ] **Step 2: Render KPI cards**

Show total campaigns, total baskets, total revenue, average basket value.

- [ ] **Step 3: Render recent activity**

Show latest campaign and basket refs from team detail.

- [ ] **Step 4: Verify**

Open `/dashboard` before and after team registration. Confirm unregistered and registered states both render clearly.

---

## Task 8: API Registration and Final Smoke Test

**Files:**
- Modify: `frontend/.env.local` if needed.

- [ ] **Step 1: Register team slug**

Only run after deciding the final team slug and contact:

```bash
curl -X POST https://api-hackathon.codedematrixtech.com/teams \
  -H "Content-Type: application/json" \
  -d '{"slug":"phasion-sense","name":"Phasion Sense","merchant_id":"phasion-sense","contact":"YOUR_EMAIL"}'
```

- [ ] **Step 2: Validate team**

Run:

```bash
curl https://api-hackathon.codedematrixtech.com/teams/phasion-sense
```

Expected: `registered` is `true`, merchant id is `phasion-sense`.

- [ ] **Step 3: Full app smoke test**

Run:

```bash
pnpm build
pnpm dev
```

Manual checks:

- `/` loads and shows Phasion Sense products.
- `/catalog` filters products and adds items to basket.
- `/studio` creates a campaign draft and publishes after team registration.
- `/campaigns` shows created campaigns.
- `/campaigns/[id]` lets customer add campaign items to basket.
- `/checkout` creates a basket and generates WhatsApp handoff.
- `/dashboard` shows team metrics.

## Self-Review

- Spec coverage: landing, catalog, campaign studio, campaign pages, checkout, dashboard, API client, and docs are covered.
- Placeholder scan: no implementation step depends on an undefined future feature.
- Type consistency: all request and response names match the OpenAPI schema fetched on 2026-05-23.
