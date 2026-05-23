export function getServerConfig() {
  return {
    apiBase: process.env.HACKATHON_API_BASE ?? "https://api-hackathon.codedematrixtech.com",
    merchantSlug: process.env.MERCHANT_SLUG ?? "phasion-sense",
    teamSlug: process.env.TEAM_SLUG ?? "phasion-sense",
    fallbackWhatsapp: process.env.FALLBACK_WHATSAPP ?? "+233595352458",
    photoroomApiKey: process.env.PHOTOROOM_API_KEY ?? "",
    predisApiKey: process.env.PREDIS_API_KEY ?? "",
    predisBrandId: process.env.PREDIS_BRAND_ID ?? "",
  }
}
