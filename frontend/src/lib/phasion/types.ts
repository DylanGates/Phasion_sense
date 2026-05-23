export interface MerchantListItem {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  whatsapp_number: string | null
}

export interface MerchantDetail extends MerchantListItem {
  brand_colors: string[] | null
}

export interface ItemResponse {
  id: string
  merchant_id: string
  name: string
  description: string | null
  price_minor: number
  currency: string
  image_urls: string[] | null
  in_stock: boolean
}

export interface CampaignSummary {
  id: string
  title: string
  copy_text: string | null
  image_urls: string[] | null
  team_slug: string | null
  created_at: number
}

export interface CampaignFeaturedItem {
  id: string
  name: string
  price_minor: number
  currency: string
  image_url: string | null
  in_stock: boolean
}

export interface CampaignDetail extends CampaignSummary {
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  featured_items: CampaignFeaturedItem[]
}

export interface CampaignCreateRequest {
  merchant_id: string
  title: string
  copy_text?: string | null
  image_urls?: string[] | null
  featured_item_ids?: string[] | null
  team_slug?: string | null
}

export interface BasketItemInput {
  item_id: string
  qty: number
  item_note?: string | null
}

export interface BasketCreateRequest {
  merchant_id: string
  items: BasketItemInput[]
  customer_name?: string | null
  customer_phone?: string | null
  customer_note?: string | null
  team_slug?: string | null
}

export interface BasketDetail {
  id: string
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  items: Array<{
    item_id: string
    name: string
    price_minor: number
    currency: string
    image_url: string | null
    in_stock: boolean
    qty: number
    item_note: string | null
  }>
  total_minor: number
  currency: string | null
  customer_name: string | null
  customer_phone: string | null
  customer_note: string | null
  team_slug: string | null
  created_at: number
}

export interface TeamDetail {
  slug: string
  name: string | null
  merchant: { id: string; name: string; whatsapp_number: string | null } | null
  contact: string | null
  registered: boolean
  baskets: Array<{
    id: string
    merchant_id: string
    total_minor: number
    currency: string | null
    created_at: number
  }>
  campaigns: Array<{
    id: string
    merchant_id: string
    title: string
    created_at: number
  }>
  created_at: number | null
}
