import { AppShell } from "@/components/phasion/app-shell"
import { CampaignStudio } from "@/components/phasion/campaign-studio"

const API_BASE = "https://api-hackathon.codedematrixtech.com"
const MERCHANT = "phasion-sense"

function imgUrl(path: string) {
  if (!path) return ""
  return path.startsWith("http") ? path : `${API_BASE}${path}`
}

export const revalidate = 0

export default async function StudioPage() {
  let products: { id: string; name: string; price: string; image: string }[] = []

  try {
    const res = await fetch(`${API_BASE}/merchants/${MERCHANT}/items`, { cache: "no-store" })
    if (res.ok) {
      const items = await res.json()
      products = items.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: `GH₵${(p.price_minor / 100).toFixed(2)}`,
        image: imgUrl(p.image_urls?.[0] ?? ""),
      }))
    }
  } catch {}

  return (
    <AppShell>
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <header className="mb-14">
          <p className="text-[11px] uppercase tracking-widest font-bold opacity-40 mb-3">Merchant Tools</p>
          <h1 className="text-4xl font-serif font-light mb-3">Campaign Studio</h1>
          <p className="text-muted-foreground max-w-xl">
            Select a product, remove its background with Photoroom, then generate a social campaign card with Predis.ai — and publish it live.
          </p>
        </header>
        <CampaignStudio products={products} />
      </div>
    </AppShell>
  )
}
