function cleanPhone(phone: string) {
  return phone.replace(/\D/g, "")
}

function formatMoney(priceMinor: number, currency: string) {
  return `${currency} ${(priceMinor / 100).toFixed(2)}`
}

export function createWhatsAppCheckoutUrl(input: {
  merchantName: string
  phoneNumber?: string | null
  fallbackPhoneNumber: string
  basket: {
    id: string
    totalMinor: number
    currency: string
    customerName?: string | null
    items: Array<{ name: string; qty: number; priceMinor: number }>
  }
}) {
  const phone = cleanPhone(input.phoneNumber?.trim() || input.fallbackPhoneNumber)
  const itemLines = input.basket.items
    .map((item) => `- ${item.name} x${item.qty}: ${formatMoney(item.priceMinor * item.qty, input.basket.currency)}`)
    .join("\n")

  const message = [
    `Hello ${input.merchantName}, I would like to place an order.`,
    "",
    `Basket ID: ${input.basket.id}`,
    input.basket.customerName ? `Customer: ${input.basket.customerName}` : null,
    "",
    "Items:",
    itemLines,
    "",
    `Total: ${formatMoney(input.basket.totalMinor, input.basket.currency)}`,
  ]
    .filter((line) => line !== null)
    .join("\n")

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
