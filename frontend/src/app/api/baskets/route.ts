import { z } from "zod"
import { phasionApi } from "@/lib/phasion/api"
import { getServerConfig } from "@/lib/server/config"
import { createWhatsAppCheckoutUrl } from "@/lib/server/whatsapp"

const Schema = z.object({
  items: z.array(z.object({
    item_id: z.string(),
    qty: z.number().int().min(1),
    item_note: z.string().nullish(),
  })).min(1),
  customer_name: z.string().nullish(),
  customer_phone: z.string().nullish(),
  customer_note: z.string().nullish(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0].message, statusCode: 400 }, { status: 400 })
    }
    const { merchantSlug, teamSlug, fallbackWhatsapp } = getServerConfig()
    const { id } = await phasionApi.createBasket({
      ...parsed.data,
      merchant_id: merchantSlug,
      team_slug: teamSlug,
    })
    const basket = await phasionApi.getBasket(id)
    const merchant = basket.merchant ?? await phasionApi.getMerchant()
    const checkoutUrl = createWhatsAppCheckoutUrl({
      merchantName: merchant.name,
      phoneNumber: basket.merchant?.whatsapp_number,
      fallbackPhoneNumber: fallbackWhatsapp,
      basket: {
        id: basket.id,
        totalMinor: basket.total_minor,
        currency: basket.currency ?? "GHS",
        customerName: basket.customer_name,
        items: basket.items.map((item) => ({
          name: item.name,
          qty: item.qty,
          priceMinor: item.price_minor,
        })),
      },
    })
    return Response.json({ id: basket.id, basket, checkoutUrl })
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
