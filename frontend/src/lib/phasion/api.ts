import { API_BASE, MERCHANT_SLUG, TEAM_SLUG } from "./config"
import type {
  BasketCreateRequest,
  BasketDetail,
  CampaignCreateRequest,
  CampaignDetail,
  CampaignSummary,
  ItemResponse,
  MerchantDetail,
  MerchantListItem,
  TeamDetail,
} from "./types"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers:
      init?.body instanceof FormData
        ? init.headers
        : {
            "Content-Type": "application/json",
            ...init?.headers,
          },
    next: init?.method ? undefined : { revalidate: 30 },
  } as RequestInit)

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(
      body?.message ?? body?.error ?? `API request failed: ${response.status}`
    )
  }

  return response.json()
}

export const phasionApi = {
  listMerchants: () => request<MerchantListItem[]>("/merchants"),

  getMerchant: (slug = MERCHANT_SLUG) =>
    request<MerchantDetail>(`/merchants/${slug}`),

  getItems: (slug = MERCHANT_SLUG) =>
    request<ItemResponse[]>(`/merchants/${slug}/items`),

  getCampaigns: (slug = MERCHANT_SLUG, teamSlug = TEAM_SLUG) =>
    request<CampaignSummary[]>(
      `/merchants/${slug}/campaigns?team_slug=${teamSlug}`
    ),

  getCampaign: (id: string) => request<CampaignDetail>(`/campaigns/${id}`),

  createCampaign: (data: CampaignCreateRequest) =>
    request<{ id: string }>("/campaigns", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createBasket: (data: BasketCreateRequest) =>
    request<{ id: string }>("/baskets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getBasket: (id: string) => request<BasketDetail>(`/baskets/${id}`),

  getTeam: (slug = TEAM_SLUG) => request<TeamDetail>(`/teams/${slug}`),
}
