import { phasionApi } from "@/lib/phasion/api"
import { assetUrl } from "@/lib/phasion/format"
import { getServerConfig } from "@/lib/server/config"

export const revalidate = 60

export async function GET() {
  try {
    const { fallbackWhatsapp } = getServerConfig()
    const [merchant, items, campaigns] = await Promise.all([
      phasionApi.getMerchant(),
      phasionApi.getItems(),
      phasionApi.getCampaigns(),
    ])
    return Response.json({
      merchant: {
        id: merchant.id,
        name: merchant.name,
        description: merchant.description?.trim() || "Campaign-ready fashion commerce for curated drops.",
        logoUrl: assetUrl(merchant.logo_url),
        brandColors: merchant.brand_colors?.length ? merchant.brand_colors : ["#111827", "#C8A45D", "#FAF7F2"],
        whatsappNumber: merchant.whatsapp_number?.trim() || fallbackWhatsapp,
      },
      products: items.map((p) => ({
        id: p.id,
        name: p.name,
        priceMinor: p.price_minor,
        price: p.price_minor / 100,
        currency: p.currency,
        imageUrls: (p.image_urls ?? []).map(assetUrl),
        inStock: p.in_stock,
      })),
      campaigns: campaigns.map((c) => ({
        id: c.id,
        title: c.title,
        copyText: c.copy_text,
        imageUrls: (c.image_urls ?? []).map(assetUrl),
        teamSlug: c.team_slug,
        createdAt: c.created_at,
      })),
    })
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
