import type {
  GenerateContentRequest,
  GenerateContentResponse,
  StageImageRequest,
  StageImageResponse,
} from "./types"

// ─── Photoroom ────────────────────────────────────────────────────────────────

export async function stageImage(
  input: StageImageRequest,
  apiKey: string,
  rehostFn: (imageBuffer: Buffer, filename: string) => Promise<string>,
): Promise<StageImageResponse> {
  const form = new FormData()
  form.append("image_url", input.imageUrl)
  if (input.backgroundPrompt) {
    form.append("background.prompt", input.backgroundPrompt)
  }

  const response = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: form,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Photoroom API failed with ${response.status}: ${text}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const imageBuffer = Buffer.from(arrayBuffer)
  const stagedImageUrl = await rehostFn(imageBuffer, "staged.png")

  return { stagedImageUrl }
}

// ─── Predis.ai ────────────────────────────────────────────────────────────────

const PREDIS_BASE = "https://brain.predis.ai/predis_api/v1"
const MAX_POLL_ATTEMPTS = 10
const POLL_INTERVAL_MS = 2000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface PredisCreateResponse {
  post_id?: string
  id?: string
}

interface PredisPollResponse {
  status?: string
  posts?: Array<{
    caption?: string
    hashtags?: string[] | string
    media_url?: string
  }>
}

export async function generateContent(
  input: GenerateContentRequest,
  apiKey: string,
  brandId: string,
  pollIntervalMs = POLL_INTERVAL_MS,
): Promise<GenerateContentResponse> {
  // Step 1: Submit content generation job
  const createResponse = await fetch(`${PREDIS_BASE}/create_content/`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand_id: brandId,
      text: input.copyHint ?? input.productName,
      media_type: "single_image",
      image_url: input.imageUrl,
    }),
  })

  if (!createResponse.ok) {
    const text = await createResponse.text().catch(() => "")
    throw new Error(`Predis.ai create failed with ${createResponse.status}: ${text}`)
  }

  const createData = (await createResponse.json()) as PredisCreateResponse
  const postId = createData.post_id ?? createData.id

  if (!postId) {
    // Predis didn't return a job ID — return safe defaults
    return { caption: input.productName, hashtags: [], imageUrl: input.imageUrl }
  }

  // Step 2: Poll until completed
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(pollIntervalMs)

    const pollResponse = await fetch(
      `${PREDIS_BASE}/get_posts/?post_id=${encodeURIComponent(postId)}`,
      { headers: { Authorization: apiKey } },
    )

    if (!pollResponse.ok) continue

    const pollData = (await pollResponse.json()) as PredisPollResponse

    if (pollData.status === "completed" && pollData.posts?.length) {
      const post = pollData.posts[0]
      const caption = post.caption ?? input.productName
      const hashtags = Array.isArray(post.hashtags)
        ? post.hashtags
        : typeof post.hashtags === "string"
          ? post.hashtags.split(/\s+/).filter(Boolean)
          : []
      const imageUrl = post.media_url ?? input.imageUrl
      return { caption, hashtags, imageUrl }
    }

    if (pollData.status === "failed") break
  }

  // Timeout or failure — return safe defaults
  return { caption: input.productName, hashtags: [], imageUrl: input.imageUrl }
}
