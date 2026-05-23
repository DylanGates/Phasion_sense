import cors from "@fastify/cors"
import Fastify from "fastify"
import { z } from "zod"
import { getConfig } from "./config"
import { normalizeCampaign, normalizeCampaignDetail, normalizeMerchant, normalizeProduct } from "./normalize"
import { generateContent, stageImage } from "./pipeline"
import { createUpstreamClient } from "./upstream"
import { createWhatsAppCheckoutUrl } from "./whatsapp"
import type { BackendConfig, UpstreamClient } from "./types"

const StageImageSchema = z.object({
  imageUrl: z.string().url(),
  backgroundPrompt: z.string().nullish(),
})

const GenerateContentSchema = z.object({
  imageUrl: z.string().url(),
  productName: z.string().min(1),
  copyHint: z.string().nullish(),
})

const BasketCreateSchema = z.object({
  items: z
    .array(
      z.object({
        item_id: z.string(),
        qty: z.number().int().min(1),
        item_note: z.string().nullish(),
      })
    )
    .min(1),
  customer_name: z.string().nullish(),
  customer_phone: z.string().nullish(),
  customer_note: z.string().nullish(),
  team_slug: z.string().nullish(),
})

const CampaignCreateSchema = z.object({
  title: z.string().min(1),
  copy_text: z.string().nullish(),
  image_urls: z.array(z.string()).nullish(),
  featured_item_ids: z.array(z.string()).nullish(),
})

interface BuildAppOptions {
  config?: BackendConfig
  upstream?: Partial<UpstreamClient>
}

export function buildApp(options: BuildAppOptions = {}) {
  const config = options.config ?? getConfig()
  const defaultUpstream = createUpstreamClient(config)
  const upstream: UpstreamClient = { ...defaultUpstream, ...options.upstream }
  const app = Fastify({ logger: false })

  void app.register(cors, { origin: true })

  app.get("/health", async () => ({
    status: "ok",
    upstream: await upstream.health(),
  }))

  app.get("/api/health", async () => ({
    status: "ok",
    upstream: await upstream.health(),
  }))

  app.get("/api/merchant", async () => normalizeMerchant(await upstream.getMerchant(), config))

  app.get("/api/products", async () => {
    const products = await upstream.getProducts()
    return products.map((product) => normalizeProduct(product, config.apiBase))
  })

  app.get("/api/campaigns", async () => {
    const campaigns = await upstream.getCampaigns()
    return campaigns.map((campaign) => normalizeCampaign(campaign, config.apiBase))
  })

  app.get<{ Params: { id: string } }>("/api/campaigns/:id", async (request) => {
    const detail = await upstream.getCampaign(request.params.id)
    return normalizeCampaignDetail(detail, config.apiBase)
  })

  app.post("/api/campaigns", async (request, reply) => {
    const parsed = CampaignCreateSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues[0].message, statusCode: 400 })
    }
    return upstream.createCampaign(parsed.data)
  })

  app.get("/api/team", async () => upstream.getTeam())

  app.get("/api/storefront", async () => {
    const [merchant, products, campaigns] = await Promise.all([
      upstream.getMerchant(),
      upstream.getProducts(),
      upstream.getCampaigns(),
    ])

    return {
      merchant: normalizeMerchant(merchant, config),
      products: products.map((product) => normalizeProduct(product, config.apiBase)),
      campaigns: campaigns.map((campaign) => normalizeCampaign(campaign, config.apiBase)),
    }
  })

  app.post("/api/baskets", async (request, reply) => {
    const parsed = BasketCreateSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues[0].message, statusCode: 400 })
    }

    const created = await upstream.createBasket(parsed.data)
    const basket = await upstream.getBasket(created.id)
    const merchant = basket.merchant ?? (await upstream.getMerchant())
    const checkoutUrl = createWhatsAppCheckoutUrl({
      merchantName: merchant.name,
      phoneNumber: merchant.whatsapp_number,
      fallbackPhoneNumber: config.fallbackWhatsapp,
      basket: {
        id: basket.id,
        totalMinor: basket.total_minor,
        currency: basket.currency ?? "GHS",
        customerName: basket.customer_name,
        items: basket.items.map((item) => ({
          name: item.name,
          qty: item.qty,
          priceMinor: item.price_minor,
        })),
      },
    })

    return {
      id: basket.id,
      basket,
      checkoutUrl,
    }
  })

  app.post("/api/pipeline/stage", async (request, reply) => {
    const parsed = StageImageSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues[0].message, statusCode: 400 })
    }

    const rehostFn = async (imageBuffer: Buffer, filename: string): Promise<string> => {
      const form = new FormData()
      const blob = new Blob([new Uint8Array(imageBuffer)], { type: "image/png" })
      form.append("file", blob, filename)
      const response = await fetch(`${config.apiBase}/uploads`, { method: "POST", body: form })
      if (!response.ok) throw new Error(`Rehost failed: ${response.status}`)
      const data = (await response.json()) as { url?: string }
      if (!data.url) throw new Error("Rehost response missing url")
      return data.url.startsWith("http") ? data.url : `${config.apiBase}${data.url}`
    }

    return stageImage(parsed.data, config.photoroomApiKey, rehostFn)
  })

  app.post("/api/pipeline/generate", async (request, reply) => {
    const parsed = GenerateContentSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.issues[0].message, statusCode: 400 })
    }

    return generateContent(parsed.data, config.predisApiKey, config.predisBrandId)
  })

  app.setErrorHandler((error, _request, reply) => {
    const statusCode = reply.statusCode >= 400 ? reply.statusCode : 502
    const message = error instanceof Error ? error.message : "Unexpected backend error"
    void reply.code(statusCode).send({ error: message, statusCode })
  })

  return app
}
