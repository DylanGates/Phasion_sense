import { describe, expect, it, vi } from "vitest"
import { buildApp } from "../app"

describe("Fastify BFF app", () => {
  it("returns backend and upstream health", async () => {
    const app = buildApp({
      upstream: {
        health: async () => ({ status: "ok", db: "ok", uploads: "ok", assets: "ok" }),
      },
    })

    const response = await app.inject({ method: "GET", url: "/health" })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      status: "ok",
      upstream: { status: "ok", db: "ok", uploads: "ok", assets: "ok" },
    })
  })

  it("POST /api/baskets returns 400 when items is missing", async () => {
    const app = buildApp({
      upstream: { createBasket: vi.fn() },
    })

    const response = await app.inject({
      method: "POST",
      url: "/api/baskets",
      payload: {},
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().statusCode).toBe(400)
    expect(typeof response.json().error).toBe("string")
  })

  it("POST /api/campaigns returns 400 when title is missing", async () => {
    const app = buildApp({
      upstream: { createCampaign: vi.fn() },
    })

    const response = await app.inject({
      method: "POST",
      url: "/api/campaigns",
      payload: {},
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().statusCode).toBe(400)
  })

  it("GET /api/merchant returns 502 when upstream throws", async () => {
    const app = buildApp({
      upstream: {
        getMerchant: async () => {
          throw new Error("upstream down")
        },
      },
    })

    const response = await app.inject({ method: "GET", url: "/api/merchant" })

    expect(response.statusCode).toBe(502)
    expect(response.json().error).toBe("upstream down")
  })

  it("returns normalized storefront data", async () => {
    const app = buildApp({
      config: {
        apiBase: "https://api-hackathon.codedematrixtech.com",
        merchantSlug: "phasion-sense",
        teamSlug: "phasion-sense",
        fallbackWhatsapp: "+233595352458",
        port: 4000,
      },
      upstream: {
        getMerchant: async () => ({
          id: "phasion-sense",
          name: "Phasion Sense",
          description: "",
          logo_url: "/images/phasion-sense/logo.png",
          brand_colors: [],
          whatsapp_number: "",
        }),
        getProducts: async () => [
          {
            id: "ps-1",
            merchant_id: "phasion-sense",
            name: "Shirt 1",
            description: "",
            price_minor: 25000,
            currency: "GHS",
            image_urls: ["/images/phasion-sense/ps1.jpg"],
            in_stock: true,
          },
        ],
        getCampaigns: async () => [],
      },
    })

    const response = await app.inject({ method: "GET", url: "/api/storefront" })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      merchant: {
        id: "phasion-sense",
        whatsappNumber: "+233595352458",
      },
      products: [{ id: "ps-1", price: 250 }],
      campaigns: [],
    })
  })
})
