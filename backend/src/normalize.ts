import type { BackendConfig, CampaignDetail, CampaignSummary, ItemResponse, MerchantDetail } from "./types"

const DEFAULT_DESCRIPTION = "Campaign-ready fashion commerce for curated drops."
const DEFAULT_BRAND_COLORS = ["#111827", "#C8A45D", "#FAF7F2"]

function absoluteUrl(path: string | null | undefined, apiBase: string) {
  if (!path) return null
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${apiBase}${path}`
}

export function normalizeMerchant(
  merchant: MerchantDetail,
  config: Pick<BackendConfig, "apiBase" | "fallbackWhatsapp">,
) {
  return {
    id: merchant.id,
    name: merchant.name,
    description: merchant.description?.trim() || DEFAULT_DESCRIPTION,
    logoUrl: absoluteUrl(merchant.logo_url, config.apiBase),
    brandColors: merchant.brand_colors?.length ? merchant.brand_colors : DEFAULT_BRAND_COLORS,
    whatsappNumber: merchant.whatsapp_number?.trim() || config.fallbackWhatsapp,
  }
}

export function normalizeProduct(product: ItemResponse, apiBase: string) {
  return {
    id: product.id,
    merchantId: product.merchant_id,
    name: product.name,
    description: product.description?.trim() || null,
    priceMinor: product.price_minor,
    price: product.price_minor / 100,
    currency: product.currency,
    imageUrls: (product.image_urls ?? []).map((url) => absoluteUrl(url, apiBase)),
    inStock: product.in_stock,
  }
}

export function normalizeCampaignDetail(campaign: CampaignDetail, apiBase: string) {
  return {
    id: campaign.id,
    title: campaign.title,
    copyText: campaign.copy_text,
    imageUrls: (campaign.image_urls ?? []).map((url) => absoluteUrl(url, apiBase)),
    teamSlug: campaign.team_slug,
    createdAt: campaign.created_at,
    merchant: campaign.merchant,
    featuredItems: campaign.featured_items.map((item) => ({
      id: item.id,
      name: item.name,
      priceMinor: item.price_minor,
      price: item.price_minor / 100,
      currency: item.currency,
      imageUrl: absoluteUrl(item.image_url, apiBase),
      inStock: item.in_stock,
    })),
  }
}

export function normalizeCampaign(campaign: CampaignSummary, apiBase: string) {
  return {
    id: campaign.id,
    title: campaign.title,
    copyText: campaign.copy_text,
    imageUrls: (campaign.image_urls ?? []).map((url) => absoluteUrl(url, apiBase)),
    teamSlug: campaign.team_slug,
    createdAt: campaign.created_at,
  }
}
