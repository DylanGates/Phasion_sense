import { z } from "zod"
import { phasionApi } from "@/lib/phasion/api"
import { assetUrl } from "@/lib/phasion/format"
import { getServerConfig } from "@/lib/server/config"

export const revalidate = 60

const CreateSchema = z.object({
  title: z.string().min(1),
  copy_text: z.string().nullish(),
  image_urls: z.array(z.string()).nullish(),
  featured_item_ids: z.array(z.string()).nullish(),
})

export async function GET() {
  try {
    const campaigns = await phasionApi.getCampaigns()
    return Response.json(campaigns.map((c) => ({
      id: c.id,
      title: c.title,
      copyText: c.copy_text,
      imageUrls: (c.image_urls ?? []).map(assetUrl),
      teamSlug: c.team_slug,
      createdAt: c.created_at,
    })))
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = CreateSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0].message, statusCode: 400 }, { status: 400 })
    }
    const { merchantSlug, teamSlug } = getServerConfig()
    const result = await phasionApi.createCampaign({
      ...parsed.data,
      merchant_id: merchantSlug,
      team_slug: teamSlug,
    })
    return Response.json(result)
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
