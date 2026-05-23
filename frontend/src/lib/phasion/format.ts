import { API_BASE } from "./config"

export function formatMoney(priceMinor: number, currency = "GHS") {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
  }).format(priceMinor / 100)
}

export function assetUrl(path: string | null | undefined) {
  if (!path) return "/placeholder.jpg"
  if (path.startsWith("http")) return path
  return `${API_BASE}${path}`
}

export function cleanWhatsAppNumber(phone: string) {
  return phone.replace(/\D/g, "")
}
