# Phasion Sense API Findings

Date tested: 2026-05-23

API base:

```txt
https://api-hackathon.codedematrixtech.com
```

## Summary

The correct merchant for this project is `phasion-sense`, not `amina-stitches`.

The API is reachable and healthy. Phasion Sense has inventory data but currently has no merchant description, no brand colors, no WhatsApp number, and no campaigns.

## Health

Request:

```bash
curl https://api-hackathon.codedematrixtech.com/health
```

Response:

```json
{"status":"ok","db":"ok","uploads":"ok","assets":"ok"}
```

## Merchants

Request:

```bash
curl https://api-hackathon.codedematrixtech.com/merchants
```

Relevant merchant:

```json
{
  "id": "phasion-sense",
  "name": "Phasion Sense",
  "description": "",
  "logo_url": "/images/phasion-sense/logo.png",
  "whatsapp_number": ""
}
```

## Merchant Detail

Request:

```bash
curl https://api-hackathon.codedematrixtech.com/merchants/phasion-sense
```

Response:

```json
{
  "id": "phasion-sense",
  "name": "Phasion Sense",
  "description": "",
  "logo_url": "/images/phasion-sense/logo.png",
  "brand_colors": [],
  "whatsapp_number": ""
}
```

Implementation impact:

- Use fallback brand colors in the frontend.
- Use fallback WhatsApp number from `NEXT_PUBLIC_FALLBACK_WHATSAPP`.
- Resolve relative image paths against the API base URL.

## Product Catalog

Request:

```bash
curl https://api-hackathon.codedematrixtech.com/merchants/phasion-sense/items
```

Response shape:

```ts
interface ItemResponse {
  id: string
  merchant_id: string
  name: string
  description: string | null
  price_minor: number
  currency: string
  image_urls: string[] | null
  in_stock: boolean
}
```

Observed products:

| ID | Name | Price Minor | Currency | Stock | Image |
|---|---:|---:|---|---|---|
| `ps-1` | Shirt 1 | 25000 | GHS | in stock | `/images/phasion-sense/ps1.jpg` |
| `ps-2` | Shirt 2 | 25000 | GHS | in stock | `/images/phasion-sense/ps2.jpg` |
| `ps-3` | Shirt 3 | 25000 | GHS | in stock | `/images/phasion-sense/ps3.jpg` |
| `ps-4` | Shirt 4 | 25000 | GHS | in stock | `/images/phasion-sense/ps4.jpg` |
| `ps-5` | Shirt 5 | 25000 | GHS | in stock | `/images/phasion-sense/ps5.jpg` |
| `ps-6` | Shirt 6 | 25000 | GHS | in stock | `/images/phasion-sense/ps6.jpeg` |
| `ps-7` | Shirt 7 | 25000 | GHS | in stock | `/images/phasion-sense/ps7.jpeg` |
| `ps-8` | Shirt 8 | 25000 | GHS | in stock | `/images/phasion-sense/ps8.jpeg` |
| `ps-9` | Shirt 9 | 25000 | GHS | in stock | `/images/phasion-sense/ps9.jpeg` |
| `ps-10` | Shirt 10 | 25000 | GHS | in stock | `/images/phasion-sense/ps10.jpeg` |
| `ps-11` | Shirt 11 | 25000 | GHS | in stock | `/images/phasion-sense/ps11.jpeg` |
| `ps-12` | Two Piece 1 | 55000 | GHS | in stock | `/images/phasion-sense/ps12.jpeg` |
| `ps-13` | Two Piece 2 | 55000 | GHS | in stock | `/images/phasion-sense/ps13.jpeg` |
| `ps-14` | Two Piece 3 | 55000 | GHS | in stock | `/images/phasion-sense/ps14.jpeg` |
| `ps-15` | Two Piece 4 | 55000 | GHS | in stock | `/images/phasion-sense/ps15.jpeg` |

## Campaigns

Request:

```bash
curl https://api-hackathon.codedematrixtech.com/merchants/phasion-sense/campaigns
```

Response:

```json
[]
```

Implementation impact:

- Campaign list needs a strong empty state.
- Studio should create the first campaign after team registration.

## Teams

Request:

```bash
curl https://api-hackathon.codedematrixtech.com/teams
```

Observed existing teams:

```json
[
  {"slug":"sylvara-team","name":"Sylvara","merchant_id":"kofi-menswear","created_at":1779553034},
  {"slug":"a5","name":"kephastetteh","merchant_id":"phasion-sense","created_at":1779551996},
  {"slug":"likekodji","name":"likekodji Team","merchant_id":"mensah","created_at":1779551213}
]
```

Recommended project slug check:

```bash
curl https://api-hackathon.codedematrixtech.com/teams/phasion-sense
```

Response:

```json
{
  "slug": "phasion-sense",
  "name": null,
  "merchant": null,
  "contact": null,
  "registered": false,
  "baskets": [],
  "campaigns": [],
  "created_at": null
}
```

Implementation impact:

- `a5` exists for Phasion Sense but should not be treated as this project's team unless confirmed.
- `phasion-sense` is not registered yet according to `GET /teams/phasion-sense`.
- Recommended team registration body:

```json
{
  "slug": "phasion-sense",
  "name": "Phasion Sense",
  "merchant_id": "phasion-sense",
  "contact": "YOUR_EMAIL"
}
```

Use `+233595352458` as the storefront WhatsApp fallback because the Phasion Sense API merchant currently returns an empty `whatsapp_number`.

## OpenAPI Schema Notes

Confirmed mutable endpoints:

- `POST /teams`
- `POST /campaigns`
- `POST /baskets`
- `POST /uploads`
- `POST /uploads/rehost`

Important constraints:

- Team slug pattern: `^[a-z0-9-]{2,40}$`
- Basket items require at least one item.
- Basket item quantity minimum is `1`.
- Campaign creation requires `merchant_id` and `title`.
- Uploads use `multipart/form-data` field name `file`.
