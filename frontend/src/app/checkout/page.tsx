import { AppShell } from "@/components/phasion/app-shell"
import { CheckoutForm } from "@/components/phasion/checkout-form"

export default function CheckoutPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order with Phasion Sense via WhatsApp.</p>
        </header>

        <CheckoutForm />
      </div>
    </AppShell>
  )
}
