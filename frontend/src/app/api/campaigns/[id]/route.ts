import { phasionApi } from "@/lib/phasion/api"
import { assetUrl } from "@/lib/phasion/format"

export const revalidate = 60

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const c = await phasionApi.getCampaign(id)
    return Response.json({
      id: c.id,
      title: c.title,
      copyText: c.copy_text,
      imageUrls: (c.image_urls ?? []).map(assetUrl),
      teamSlug: c.team_slug,
      createdAt: c.created_at,
      merchant: c.merchant,
      featuredItems: c.featured_items.map((item) => ({
        id: item.id,
        name: item.name,
        priceMinor: item.price_minor,
        price: item.price_minor / 100,
        currency: item.currency,
        imageUrl: assetUrl(item.image_url),
        inStock: item.in_stock,
      })),
    })
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
