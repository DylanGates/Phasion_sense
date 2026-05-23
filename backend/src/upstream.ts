import type { BackendConfig, BasketCreateRequest, UpstreamClient } from "./types"

async function request<T>(config: BackendConfig, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.apiBase}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string; error?: string } | null
    throw new Error(body?.message ?? body?.error ?? `Hackathon API failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function createUpstreamClient(config: BackendConfig): Required<UpstreamClient> {
  return {
    health: () => request(config, "/health"),
    getMerchant: () => request(config, `/merchants/${config.merchantSlug}`),
    getProducts: () => request(config, `/merchants/${config.merchantSlug}/items`),
    getCampaigns: () => request(config, `/merchants/${config.merchantSlug}/campaigns?team_slug=${config.teamSlug}`),
    getCampaign: (id) => request(config, `/campaigns/${id}`),
    getTeam: () => request(config, `/teams/${config.teamSlug}`),
    createCampaign: (body) =>
      request(config, "/campaigns", {
        method: "POST",
        body: JSON.stringify({
          ...(body as Record<string, unknown>),
          merchant_id: config.merchantSlug,
          team_slug: config.teamSlug,
        }),
      }),
    createBasket: (body: BasketCreateRequest) =>
      request(config, "/baskets", {
        method: "POST",
        body: JSON.stringify({
          ...body,
          merchant_id: body.merchant_id ?? config.merchantSlug,
          team_slug: body.team_slug ?? config.teamSlug,
        }),
      }),
    getBasket: (id) => request(config, `/baskets/${id}`),
  }
}
