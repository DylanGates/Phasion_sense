import { describe, expect, it } from "vitest"
import { normalizeCampaignDetail, normalizeMerchant, normalizeProduct } from "../normalize"

describe("normalizers", () => {
  it("fills empty Phasion Sense merchant fields with backend fallbacks", () => {
    const merchant = normalizeMerchant(
      {
        id: "phasion-sense",
        name: "Phasion Sense",
        description: "",
        logo_url: "/images/phasion-sense/logo.png",
        brand_colors: [],
        whatsapp_number: "",
      },
      {
        apiBase: "https://api-hackathon.codedematrixtech.com",
        fallbackWhatsapp: "+233595352458",
      },
    )

    expect(merchant).toEqual({
      id: "phasion-sense",
      name: "Phasion Sense",
      description: "Campaign-ready fashion commerce for curated drops.",
      logoUrl: "https://api-hackathon.codedematrixtech.com/images/phasion-sense/logo.png",
      brandColors: ["#111827", "#C8A45D", "#FAF7F2"],
      whatsappNumber: "+233595352458",
    })
  })

  it("normalizes campaign detail — absolutifies image URLs and featured item image", () => {
    const detail = normalizeCampaignDetail(
      {
        id: "camp-1",
        title: "Weekend Edit",
        copy_text: "Fresh drops.",
        image_urls: ["/images/phasion-sense/ps1.jpg"],
        team_slug: "phasion-sense",
        created_at: 1700000000,
        merchant: { id: "phasion-sense", name: "Phasion Sense", whatsapp_number: null },
        featured_items: [
          {
            id: "ps-1",
            name: "Shirt 1",
            price_minor: 25000,
            currency: "GHS",
            image_url: "/images/phasion-sense/ps1.jpg",
            in_stock: true,
          },
        ],
      },
      "https://api-hackathon.codedematrixtech.com",
    )

    expect(detail.imageUrls[0]).toBe(
      "https://api-hackathon.codedematrixtech.com/images/phasion-sense/ps1.jpg",
    )
    expect(detail.featuredItems[0].imageUrl).toBe(
      "https://api-hackathon.codedematrixtech.com/images/phasion-sense/ps1.jpg",
    )
    expect(detail.featuredItems[0].price).toBe(250)
    expect(detail.featuredItems[0].inStock).toBe(true)
  })

  it("normalizes product image URLs and exposes major currency units", () => {
    const product = normalizeProduct(
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
      "https://api-hackathon.codedematrixtech.com",
    )

    expect(product).toEqual({
      id: "ps-1",
      merchantId: "phasion-sense",
      name: "Shirt 1",
      description: null,
      priceMinor: 25000,
      price: 250,
      currency: "GHS",
      imageUrls: ["https://api-hackathon.codedematrixtech.com/images/phasion-sense/ps1.jpg"],
      inStock: true,
    })
  })
})
