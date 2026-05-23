# Phasion Sense — User Flows

> System design covering every user journey, including success, failure, loading, empty, and idempotency states.
> Incorporates the AI-powered image staging and social content pipeline.

---

## Personas

| Persona | Description | Primary Surface |
|---------|-------------|-----------------|
| **Customer** | Browses products, adds to basket, checks out via WhatsApp | `/`, `/catalog`, `/campaigns/[id]`, `/checkout` |
| **Merchant** | Creates campaigns, monitors orders and revenue | `/studio`, `/dashboard` |
| **System** | Background AI pipeline, API writes | Internal / webhooks |

---

## Flow Map

```
Customer
  ├── Browse Storefront (/)
  ├── Explore Catalog (/catalog)
  ├── View Campaign (/campaigns/[id])
  ├── Add to Basket (global drawer)
  └── Checkout (/checkout) ──► WhatsApp Handoff

Merchant
  ├── Register Team (one-time setup)
  ├── Studio: Create Campaign (/studio)
  │     ├── Upload Product Image ──► AI Staging Pipeline
  │     │         ├── Photoroom/Claid ──► Enhanced Image
  │     │         ├── Predis.ai ──► Social Content (Reels, carousel, copy)
  │     │         └── Runway ──► Cinematic Video Clip
  │     └── Publish Campaign ──► /campaigns/[id]
  └── Dashboard: Monitor Metrics (/dashboard)
```

---

## Flow 1: Browse Storefront

**Route:** `/`  
**Actor:** Customer  
**Trigger:** User opens app or navigates to root

### Happy Path

```
1. Page loads server-side
2. Fetch GET /merchants/phasion-sense        ← merchant meta
3. Fetch GET /merchants/phasion-sense/items  ← product catalog
4. Render hero, featured products (first 4), campaign CTA
5. User clicks "Shop All" → /catalog
6. User clicks "View Campaigns" → /campaigns
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Loading** | Server fetch in progress | Skeleton hero + 4 product card skeletons |
| **Success** | Both fetches resolve | Full hero, product grid, CTAs |
| **Merchant API error** | `/merchants/phasion-sense` 5xx/timeout | Fallback: use `PHASION_BRAND` constants (name, tagline). Hide logo or show placeholder |
| **Empty catalog** | Items array is `[]` | Show "No products yet" message, hide grid |
| **Partial error** | Items fetch fails, merchant succeeds | Show hero, display "Catalog unavailable" with retry CTA |

### Idempotency

`GET` only. Safe to reload/re-navigate. Server cache revalidates every 30 s (`next: { revalidate: 30 }`).

---

## Flow 2: Browse Catalog

**Route:** `/catalog`  
**Actor:** Customer  
**Trigger:** User navigates to catalog or clicks "Shop All"

### Happy Path

```
1. Page loads (server fetch)
2. Fetch GET /merchants/phasion-sense/items
3. Render full 15-product grid
4. User types in search field → client-side filter by name
5. User clicks "Add to Basket" on a product
6. Basket store adds line, opens drawer
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Loading** | Fetch in progress | Skeleton grid (12 cards) |
| **Success** | Products returned | Searchable grid |
| **Search: no results** | Filter returns `[]` | "No products match '[query]'" with clear-search button |
| **Out of stock** | `in_stock: false` | Badge "Out of stock", Add button disabled |
| **API error** | Fetch fails | "Could not load catalog" + Retry button |
| **Empty** | `items: []` | "No products available yet" |

### Idempotency

`GET` only. Search is purely client-side, no API call.

---

## Flow 3: Add to Basket

**Surface:** Global basket drawer (all pages)  
**Actor:** Customer  
**Trigger:** "Add to Basket" button on any product card or campaign page

### Happy Path

```
1. Customer clicks "Add to Basket"
2. basketStore.addItem(item, qty=1)
   a. If item already in basket → increment qty
   b. If new item → append line
3. Drawer opens automatically (isOpen: true)
4. Badge on nav updates with new line count
5. Customer continues browsing
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Item added** | New item | Drawer opens, line appended |
| **Qty incremented** | Same item added again | Drawer opens, qty updates |
| **Out of stock guard** | `item.in_stock === false` | Button disabled; store ignores call silently |
| **Drawer open** | `isOpen: true` | Side drawer slides in |
| **Drawer closed** | User closes or navigates away | `isOpen: false`, basket state persists |
| **Empty basket** | No lines | Drawer shows "Your basket is empty" + Browse CTA |

### Idempotency / Persistence

Basket state is persisted to `localStorage` (key: `phasion-sense-basket`) via Zustand `persist` middleware. Survives page refresh. Clearing browser storage resets it.

---

## Flow 4: Checkout and WhatsApp Handoff

**Route:** `/checkout`  
**Actor:** Customer  
**Trigger:** Customer clicks "Checkout" in basket drawer

### Happy Path

```
1. Customer arrives at /checkout
2. Basket lines displayed with qty controls and subtotal
3. Customer fills: name, phone (optional), note (optional)
4. Customer clicks "Place Order"
5. POST /baskets
   Body: {
     merchant_id: "phasion-sense",
     items: [{item_id, qty, item_note}],
     customer_name, customer_phone, customer_note,
     team_slug: "phasion-sense"
   }
6. API returns { id: "basket-abc123" }
7. basketStore.clearBasket()
8. Generate WhatsApp URL:
   wa.me/{phone}?text=Order%20%23basket-abc123%20...
9. Redirect to WhatsApp / open in new tab
```

### WhatsApp Message Format

```
Order #basket-abc123

Items:
- Shirt 1 x2 — GHS 500
- Two Piece 1 x1 — GHS 550

Total: GHS 1,050

Merchant: Phasion Sense
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Loading** | Form idle | "Place Order" button enabled |
| **Submitting** | POST in flight | Button shows spinner, disabled |
| **Success** | `{ id }` returned | Clear basket, open WhatsApp link |
| **API error** | 4xx/5xx | Toast: "Order failed: [message]". Basket NOT cleared. Retry safe. |
| **Validation error** | Empty basket on submit | "Add items to your basket first" |
| **Empty basket arrival** | Navigates to /checkout with no items | Redirect to /catalog with message |
| **No WhatsApp number** | Merchant and fallback both empty | Show order ID only, no WhatsApp button. Log warning. |

### Idempotency

`POST /baskets` is NOT idempotent — each submission creates a new basket. The UI must prevent double-submit (button disabled during POST). On API error, basket is preserved so customer can retry.

---

## Flow 5: View Campaign

**Route:** `/campaigns/[id]`  
**Actor:** Customer  
**Trigger:** Clicking a campaign card or sharing a campaign URL

### Happy Path

```
1. Server fetches GET /campaigns/{id}
2. Render: campaign hero image, title, copy text
3. Render: featured products with Add to Basket buttons
4. Customer adds items and proceeds to /checkout
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Loading** | Server fetch | Hero skeleton + product skeletons |
| **Success** | Campaign found | Full campaign page |
| **Not found** | API returns 404 | "Campaign not found" + link back to /campaigns |
| **No featured items** | `featured_items: []` | Campaign renders without product section |
| **No hero image** | `image_urls: null/[]` | Use branded gradient placeholder |

---

## Flow 6: Campaign List

**Route:** `/campaigns`  
**Actor:** Customer / Merchant  
**Trigger:** Navigate to campaigns

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Loading** | Fetch in progress | Card skeletons |
| **Campaigns exist** | Array with items | Grid of campaign cards |
| **Empty state** | `campaigns: []` | "No campaigns yet. Create your first campaign in Studio." + link to /studio |
| **API error** | Fetch fails | "Could not load campaigns" + Retry |

### Idempotency

`GET` only. Safe to navigate repeatedly.

---

## Flow 7: Team Registration (One-Time Setup)

**Actor:** Merchant  
**Trigger:** First-time setup before publishing campaigns or viewing dashboard metrics

### Happy Path

```
1. Merchant decides team slug (recommended: "phasion-sense")
2. POST /teams
   Body: {
     slug: "phasion-sense",
     name: "Phasion Sense",
     merchant_id: "phasion-sense",
     contact: "merchant@email.com"
   }
3. API returns team record with registered: true
4. Store TEAM_SLUG in NEXT_PUBLIC_TEAM_SLUG env var
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Not registered** | Team slug doesn't exist in API | Dashboard shows setup instructions panel |
| **Registration success** | POST /teams 200 | Dashboard refreshes, shows metrics |
| **Slug taken** | 409 Conflict | "This team slug is already registered. Choose another." |
| **Validation error** | Slug fails `^[a-z0-9-]{2,40}$` | "Slug must be 2-40 lowercase letters, numbers, or hyphens" |
| **Registered** | `registered: true` from GET /teams/{slug} | Dashboard renders normally |

### Idempotency

`POST /teams` is NOT idempotent. Sending the same slug twice returns a 409 conflict. The app should check `GET /teams/{slug}` first and skip registration if already registered (`registered: true`).

---

## Flow 8: Create Campaign (Studio)

**Route:** `/studio`  
**Actor:** Merchant  
**Trigger:** Navigate to Studio

### Happy Path

```
1. Merchant opens /studio
2. Draft state loaded from localStorage ("phasion-sense-campaign-draft")
3. Merchant fills: title, copy_text, featured product IDs
4. Merchant uploads product image (or provides URL)
   → Optional: trigger AI Staging Pipeline (see Flow 9)
5. Merchant clicks "Publish"
6. POST /campaigns
   Body: {
     merchant_id: "phasion-sense",
     title, copy_text, image_urls, featured_item_ids,
     team_slug: "phasion-sense"
   }
7. API returns { id: "campaign-xyz" }
8. Draft cleared from localStorage
9. Redirect to /campaigns/campaign-xyz
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Draft exists** | localStorage has draft | Form pre-populated with draft |
| **Draft empty** | First visit | Blank form |
| **Preview** | Any field edited | Live preview panel updates |
| **Submitting** | POST in flight | Publish button spinner, disabled |
| **Success** | `{ id }` returned | Draft cleared, redirect to campaign page |
| **API error** | 4xx/5xx | Toast error, draft preserved, retry safe |
| **Title missing** | Required field empty | Inline validation error |
| **No team slug** | TEAM_SLUG not set | Warning banner: "Register your team first" |

### Idempotency

Draft saves to localStorage on every field change (debounced). Multiple saves are safe. Campaign publish (`POST /campaigns`) is NOT idempotent — each click creates a new campaign. UI must disable button during submit.

---

## Flow 9: AI Staging Pipeline (New — Upgrade Flow)

**Actor:** Merchant (triggered from Studio)  
**Trigger:** Merchant uploads or selects a raw product image in Studio

```
Raw Product Image
      │
      ▼
[Step 1] Rehost or Upload
POST /uploads/rehost  or  POST /uploads (multipart)
Returns: { url: "https://..." }
      │
      ▼
[Step 2] AI Background & Staging — Photoroom API or Claid.ai API
  Input: image URL
  Photoroom:  background removal + luxury studio background via background.prompt
  Claid.ai:   AI Fashion API — flat-lay → on-model photoshoot
  Output: staged_image_url
      │
      ▼
[Step 3] AI Social Content — Predis.ai API
  Input: staged_image_url + product name + copy_text
  Output: {
    instagram_reel_url,
    carousel_images[],
    tiktok_video_url,
    caption,
    hashtags,
    brand_colors[]
  }
      │
  (Optional Branch)
      ▼
[Step 4] Cinematic Video — Runway API (Gen-3/Gen-4)
  Input: staged_image_url + text prompt
  Method: POST /v1/image_to_video (async)
  Poll:   GET /v1/tasks/{taskId} until status == "SUCCEEDED"
  Output: video_url (5-10 second cinematic clip)
      │
      ▼
[Step 5] Merchant Review & Publish
  Preview all outputs in Studio
  Select: image, video, or generated social asset as campaign hero
  Publish campaign via POST /campaigns
```

### States — Step by Step

#### Upload / Rehost

| State | UI Behaviour |
|-------|--------------|
| **Uploading** | Progress bar, button disabled |
| **Success** | Thumbnail preview shown |
| **File too large** | "Max file size is 10 MB" |
| **Wrong format** | "Please upload a JPG, PNG, or WebP image" |
| **API error** | "Upload failed. Try again." |

#### Photoroom / Claid Staging

| State | UI Behaviour |
|-------|--------------|
| **Processing** | "Staging image…" spinner |
| **Success** | Before/after comparison shown, staged URL stored in draft |
| **API timeout** | "Staging timed out. Continue with original image?" |
| **API error (auth)** | "AI staging unavailable" — fallback to original image |
| **Rate limit** | Retry with exponential backoff (3 attempts), then show error |

#### Predis.ai Content Generation

| State | UI Behaviour |
|-------|--------------|
| **Generating** | "Creating social content…" with pulsing preview |
| **Success** | Tabs: Caption / Reel / Carousel / TikTok — preview each |
| **Error** | "Content generation unavailable" — merchant writes copy manually |

#### Runway Video Generation (Async)

| State | UI Behaviour |
|-------|--------------|
| **Task submitted** | "Video generating… this takes 30-90 seconds" |
| **Polling** | Progress indicator, poll every 5 s |
| **SUCCEEDED** | Video player shown in Studio |
| **FAILED** | "Video generation failed. Use staged image instead." |
| **Timeout (>3 min)** | "Taking longer than expected. Check back later." + task ID stored |

### Idempotency

- `/uploads` and `/uploads/rehost`: Each call creates a new upload record. Store the returned URL in the campaign draft to avoid re-uploading.
- Photoroom/Claid/Predis calls: Not idempotent by nature. Cache results in draft state keyed by `image_url` to avoid re-processing the same image.
- Runway tasks: Store `taskId` in draft. On component remount, resume polling from stored `taskId` instead of re-submitting.

---

## Flow 10: Dashboard — Merchant Metrics

**Route:** `/dashboard`  
**Actor:** Merchant  
**Trigger:** Navigate to dashboard

### Happy Path

```
1. Fetch GET /teams/phasion-sense
2. If registered: render KPI cards
   - Total Campaigns
   - Total Baskets (orders)
   - Total Revenue (sum of basket totals)
   - Avg Basket Value
3. Render recent activity: last 5 campaigns, last 5 baskets
```

### States

| State | Trigger | UI Behaviour |
|-------|---------|--------------|
| **Loading** | Fetch in progress | KPI skeleton cards |
| **Registered + data** | Team exists with history | Full dashboard |
| **Registered + no data** | New team, no orders/campaigns | KPI cards show 0, empty activity list |
| **Not registered** | Team slug not found (404) | Setup panel: "Register your team to unlock metrics" |
| **API error** | Fetch fails | "Dashboard unavailable. Try again." |

### Idempotency

`GET` only. Safe to refresh.

---

## Summary: Idempotency Matrix

| Endpoint | Method | Idempotent? | Notes |
|----------|--------|-------------|-------|
| `GET /merchants/phasion-sense` | GET | ✅ Yes | Safe to retry |
| `GET /merchants/phasion-sense/items` | GET | ✅ Yes | Cached 30s |
| `GET /merchants/phasion-sense/campaigns` | GET | ✅ Yes | |
| `GET /campaigns/{id}` | GET | ✅ Yes | |
| `GET /teams/{slug}` | GET | ✅ Yes | Check before POST /teams |
| `GET /baskets/{id}` | GET | ✅ Yes | |
| `POST /campaigns` | POST | ❌ No | Each call creates a new campaign. Disable UI during submit. |
| `POST /baskets` | POST | ❌ No | Each call creates a new basket. Disable UI during submit. |
| `POST /teams` | POST | ❌ No | Returns 409 if slug exists. Check GET first. |
| `POST /uploads` | POST | ❌ No | Cache returned URL in draft. |
| `POST /uploads/rehost` | POST | ❌ No | Cache returned URL in draft. |
| Photoroom/Claid API | POST | ❌ No | Cache result by input image URL. |
| Predis.ai API | POST | ❌ No | Cache result by input image URL. |
| Runway API (submit) | POST | ❌ No | Store taskId in draft. Resume polling on remount. |
| Runway API (poll) | GET | ✅ Yes | Safe to poll repeatedly. |

---

## Error Handling Conventions

1. **API 4xx:** Show specific message from `body.message ?? body.error`. Do not retry automatically.
2. **API 5xx / timeout:** Show generic error with Retry button. Retry safe for GETs. Show warning for POSTs (may have already succeeded).
3. **Network offline:** Show persistent banner "You appear to be offline." Disable all write actions.
4. **Third-party API (Photoroom/Predis/Runway):** Degrade gracefully — always offer "continue without AI enhancement" path.
5. **Authentication:** Not implemented in MVP. All endpoints are unauthenticated by hackathon design.

---

## Navigation / Routing Summary

```
/ (Storefront)
├── /catalog              — full product grid
├── /campaigns            — campaign list
│   └── /campaigns/[id]  — campaign detail (customer-facing)
├── /studio               — campaign builder (merchant)
├── /dashboard            — merchant metrics
└── /checkout             — basket review + WhatsApp handoff
```

All routes are reachable from the to`p navigation. The basket drawer is global (rendered in app shell) and accessible from every page.
