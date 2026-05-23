import type { BackendConfig } from "./types"

export function getConfig(env: NodeJS.ProcessEnv = process.env): BackendConfig {
  return {
    apiBase: env.HACKATHON_API_BASE ?? "https://api-hackathon.codedematrixtech.com",
    merchantSlug: env.MERCHANT_SLUG ?? "phasion-sense",
    teamSlug: env.TEAM_SLUG ?? "phasion-sense",
    fallbackWhatsapp: env.FALLBACK_WHATSAPP ?? "+233595352458",
    port: Number(env.PORT ?? 4000),
    photoroomApiKey: env.PHOTOROOM_API_KEY ?? "",
    predisApiKey: env.PREDIS_API_KEY ?? "",
    predisBrandId: env.PREDIS_BRAND_ID ?? "",
  }
}
