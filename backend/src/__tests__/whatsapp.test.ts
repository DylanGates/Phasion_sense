import { describe, expect, it } from "vitest"
import { createWhatsAppCheckoutUrl } from "../whatsapp"

describe("createWhatsAppCheckoutUrl", () => {
  it("uses the fallback WhatsApp number and encodes the basket summary", () => {
    const url = createWhatsAppCheckoutUrl({
      merchantName: "Phasion Sense",
      phoneNumber: "",
      fallbackPhoneNumber: "+233595352458",
      basket: {
        id: "basket-1",
        totalMinor: 50000,
        currency: "GHS",
        customerName: "Nana",
        items: [
          {
            name: "Shirt 1",
            qty: 2,
            priceMinor: 25000,
          },
        ],
      },
    })

    expect(url.startsWith("https://wa.me/233595352458?text=")).toBe(true)
    expect(decodeURIComponent(url)).toContain("Hello Phasion Sense")
    expect(decodeURIComponent(url)).toContain("Basket ID: basket-1")
    expect(decodeURIComponent(url)).toContain("Shirt 1 x2")
    expect(decodeURIComponent(url)).toContain("Total: GHS 500.00")
  })
})
