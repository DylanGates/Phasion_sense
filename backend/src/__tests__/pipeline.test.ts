import { afterEach, describe, expect, it, vi } from "vitest"
import { buildApp } from "../app"
import { generateContent, stageImage } from "../pipeline"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("stageImage", () => {
  it("calls Photoroom and rehosts the resulting buffer", async () => {
    const fakeBuffer = Buffer.from("fake-png-data")
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => fakeBuffer.buffer,
      }),
    )

    const rehostFn = vi.fn().mockResolvedValueOnce("https://cdn.example.com/staged.png")

    const result = await stageImage(
      { imageUrl: "https://example.com/product.jpg", backgroundPrompt: "luxury studio" },
      "test-photoroom-key",
      rehostFn,
    )

    expect(result.stagedImageUrl).toBe("https://cdn.example.com/staged.png")
    expect(rehostFn).toHaveBeenCalledOnce()
  })
})

describe("generateContent", () => {
  it("polls Predis and returns caption, hashtags, and imageUrl", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ post_id: "abc123" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: "completed",
          posts: [
            {
              caption: "Fresh drops from Phasion Sense",
              hashtags: ["#fashion", "#style"],
              media_url: "https://img.predis.ai/out.jpg",
            },
          ],
        }),
      })

    vi.stubGlobal("fetch", fetchMock)

    const result = await generateContent(
      { imageUrl: "https://example.com/staged.jpg", productName: "Shirt 1" },
      "test-predis-key",
      "test-brand-id",
    )

    expect(result.caption).toBe("Fresh drops from Phasion Sense")
    expect(result.hashtags).toEqual(["#fashion", "#style"])
    expect(result.imageUrl).toBe("https://img.predis.ai/out.jpg")
  })

  it("returns safe defaults when Predis times out", async () => {
    // All poll attempts return non-completed status
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ post_id: "abc123" }),
      })
      .mockResolvedValue({
        ok: true,
        json: async () => ({ status: "pending", posts: [] }),
      })

    vi.stubGlobal("fetch", fetchMock)

    const result = await generateContent(
      { imageUrl: "https://example.com/staged.jpg", productName: "Shirt 1" },
      "test-predis-key",
      "test-brand-id",
      0, // zero poll interval so test doesn't sleep
    )

    expect(result.caption).toBe("Shirt 1")
    expect(result.hashtags).toEqual([])
    expect(result.imageUrl).toBe("https://example.com/staged.jpg")
  })
})

describe("pipeline routes", () => {
  it("POST /api/pipeline/stage returns 400 when imageUrl is missing", async () => {
    const app = buildApp()

    const response = await app.inject({
      method: "POST",
      url: "/api/pipeline/stage",
      payload: {},
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().statusCode).toBe(400)
    expect(typeof response.json().error).toBe("string")
  })

  it("POST /api/pipeline/generate returns 400 when productName is missing", async () => {
    const app = buildApp()

    const response = await app.inject({
      method: "POST",
      url: "/api/pipeline/generate",
      payload: { imageUrl: "https://example.com/img.jpg" },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().statusCode).toBe(400)
  })
})
