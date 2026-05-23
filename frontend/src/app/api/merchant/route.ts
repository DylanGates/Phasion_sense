import { phasionApi } from "@/lib/phasion/api"
import { getServerConfig } from "@/lib/server/config"
import { assetUrl } from "@/lib/phasion/format"

export const revalidate = 60

export async function GET() {
  try {
    const { fallbackWhatsapp } = getServerConfig()
    const m = await phasionApi.getMerchant()
    return Response.json({
      id: m.id,
      name: m.name,
      description: m.description?.trim() || "Campaign-ready fashion commerce for curated drops.",
      logoUrl: assetUrl(m.logo_url),
      brandColors: m.brand_colors?.length ? m.brand_colors : ["#111827", "#C8A45D", "#FAF7F2"],
      whatsappNumber: m.whatsapp_number?.trim() || fallbackWhatsapp,
    })
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
