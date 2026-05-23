import { phasionApi } from "@/lib/phasion/api"
import { assetUrl } from "@/lib/phasion/format"

export const revalidate = 60

export async function GET() {
  try {
    const items = await phasionApi.getItems()
    return Response.json(items.map((p) => ({
      id: p.id,
      merchantId: p.merchant_id,
      name: p.name,
      description: p.description?.trim() ?? null,
      priceMinor: p.price_minor,
      price: p.price_minor / 100,
      currency: p.currency,
      imageUrls: (p.image_urls ?? []).map(assetUrl),
      inStock: p.in_stock,
    })))
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
