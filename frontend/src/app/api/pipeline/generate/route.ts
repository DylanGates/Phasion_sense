import { z } from "zod"
import { getServerConfig } from "@/lib/server/config"
import { generateContent } from "@/lib/server/pipeline"

export const runtime = "nodejs"

const Schema = z.object({
  imageUrl: z.string().url(),
  productName: z.string().min(1),
  copyHint: z.string().nullish(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0].message, statusCode: 400 }, { status: 400 })
    }
    const { predisApiKey, predisBrandId } = getServerConfig()
    const result = await generateContent(
      parsed.data.imageUrl,
      parsed.data.productName,
      parsed.data.copyHint,
      predisApiKey,
      predisBrandId,
    )
    return Response.json(result)
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
