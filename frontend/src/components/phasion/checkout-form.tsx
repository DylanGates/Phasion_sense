"use client"

import { useState } from "react"
import { ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MOCK_ITEMS = [
  { id: "1", name: "Classic Easy Zipper Tote", price: 298, qty: 1, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&auto=format&fit=crop" },
  { id: "2", name: "Concertina Phone Bag", price: 248, qty: 1, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=200&auto=format&fit=crop" }
]

export function CheckoutForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const total = MOCK_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate WhatsApp Message
    const itemsText = MOCK_ITEMS.map(i => `- ${i.name} (x${i.qty})`).join("\n")
    const message = `Hello Phasion Sense! I'd like to place an order:\n\n${itemsText}\n\nTotal: $${total}\n\nName: ${name}\nPhone: ${phone}\nNote: ${note}`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/233595352458?text=${encodedMessage}`
    
    window.open(whatsappUrl, "_blank")
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-3xl font-serif">Order Initiated!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We've opened WhatsApp to finalize your order. 
          Please send the message to our team to complete your purchase.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
          Return to Checkout
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
      {/* Review Section */}
      <div className="lg:col-span-7">
        <h2 className="text-2xl font-serif mb-8 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6" />
          Review Your Selection
        </h2>
        
        <div className="flex flex-col gap-6">
          {MOCK_ITEMS.map((item) => (
            <div key={item.id} className="flex gap-6 border-b border-border pb-6 last:border-0">
              <div className="w-24 aspect-[3/4] bg-muted overflow-hidden">
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-grow flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-bold">${item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-secondary/20 flex flex-col gap-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="text-green-600 uppercase text-[10px] font-bold tracking-widest">Complimentary</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between text-lg font-serif">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:col-span-5">
        <div className="sticky top-24">
          <h2 className="text-2xl font-serif mb-8">Your Details</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[11px] uppercase tracking-widest font-bold">Full Name</Label>
              <Input 
                id="name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-[11px] uppercase tracking-widest font-bold">WhatsApp Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233..." 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="note" className="text-[11px] uppercase tracking-widest font-bold">Note for Merchant (Optional)</Label>
              <Textarea 
                id="note" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Size preferences, delivery instructions..." 
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full mt-4 gap-2" size="lg">
              Place Order via WhatsApp
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
              By clicking "Place Order", we will open WhatsApp with your pre-filled order details. 
              Our team will then confirm availability and delivery with you directly.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
