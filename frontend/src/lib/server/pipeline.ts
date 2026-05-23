const PREDIS_BASE = "https://brain.predis.ai/predis_api/v1"
const MAX_POLL = 10
const POLL_MS = 2000

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}

export async function stageImage(
  imageUrl: string,
  backgroundPrompt: string | null | undefined,
  apiKey: string,
  rehostFn: (buf: Buffer, filename: string) => Promise<string>,
): Promise<string> {
  const form = new FormData()
  form.append("image_url", imageUrl)
  if (backgroundPrompt) form.append("background.prompt", backgroundPrompt)

  const res = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Photoroom failed ${res.status}: ${text}`)
  }

  const arrayBuffer = await res.arrayBuffer()
  const buf = Buffer.from(arrayBuffer)
  return rehostFn(buf, "staged.png")
}

export async function generateContent(
  imageUrl: string,
  productName: string,
  copyHint: string | null | undefined,
  apiKey: string,
  brandId: string,
  pollIntervalMs = POLL_MS,
): Promise<{ caption: string; hashtags: string[]; imageUrl: string }> {
  const safe = { caption: productName, hashtags: [], imageUrl }

  const createRes = await fetch(`${PREDIS_BASE}/create_content/`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      brand_id: brandId,
      text: copyHint ?? productName,
      media_type: "single_image",
      image_url: imageUrl,
    }),
  })
  if (!createRes.ok) return safe

  const createData = (await createRes.json()) as { post_id?: string; id?: string }
  const postId = createData.post_id ?? createData.id
  if (!postId) return safe

  for (let i = 0; i < MAX_POLL; i++) {
    if (i > 0) await sleep(pollIntervalMs)
    const pollRes = await fetch(
      `${PREDIS_BASE}/get_posts/?post_id=${encodeURIComponent(postId)}`,
      { headers: { Authorization: apiKey } },
    )
    if (!pollRes.ok) continue

    const poll = (await pollRes.json()) as {
      status?: string
      posts?: Array<{ caption?: string; hashtags?: string[] | string; media_url?: string }>
    }

    if (poll.status === "completed" && poll.posts?.length) {
      const post = poll.posts[0]
      return {
        caption: post.caption ?? productName,
        hashtags: Array.isArray(post.hashtags)
          ? post.hashtags
          : typeof post.hashtags === "string"
            ? post.hashtags.split(/\s+/).filter(Boolean)
            : [],
        imageUrl: post.media_url ?? imageUrl,
      }
    }
    if (poll.status === "failed") break
  }
  return safe
}
