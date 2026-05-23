import { z } from "zod"
import { getServerConfig } from "@/lib/server/config"
import { stageImage } from "@/lib/server/pipeline"

export const runtime = "nodejs"

const Schema = z.object({
  imageUrl: z.string().url(),
  backgroundPrompt: z.string().nullish(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0].message, statusCode: 400 }, { status: 400 })
    }
    const { photoroomApiKey, apiBase } = getServerConfig()

    const rehostFn = async (buf: Buffer, filename: string): Promise<string> => {
      const form = new FormData()
      form.append("file", new Blob([new Uint8Array(buf)], { type: "image/png" }), filename)
      const res = await fetch(`${apiBase}/uploads`, { method: "POST", body: form })
      if (!res.ok) throw new Error(`Rehost failed: ${res.status}`)
      const data = (await res.json()) as { url?: string }
      if (!data.url) throw new Error("Rehost response missing url")
      return data.url.startsWith("http") ? data.url : `${apiBase}${data.url}`
    }

    const stagedImageUrl = await stageImage(
      parsed.data.imageUrl,
      parsed.data.backgroundPrompt,
      photoroomApiKey,
      rehostFn,
    )
    return Response.json({ stagedImageUrl })
  } catch (e) {
    return Response.json({ error: String(e), statusCode: 502 }, { status: 502 })
  }
}
