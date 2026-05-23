"use client"

import { useState } from "react"
import { ImagePlus, Loader2, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProductCard } from "./product-card"

// Mock products for the selector
const PRODUCTS = [
  {
    id: "ps-1",
    name: "Classic Easy Zipper Tote",
    price: "$298",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ps-2",
    name: "Concertina Phone Bag",
    price: "$248",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ps-12",
    name: "Wool Cashmere Sweater Coat",
    price: "$398",
    image: "https://images.unsplash.com/photo-1539109132314-347752d87b40?q=80&w=800&auto=format&fit=crop",
  }
]

export function CampaignStudio() {
  const [title, setTitle] = useState("Weekend Shirt Edit")
  const [copy, setCopy] = useState("A tight edit of easy shirts and two-piece sets from Phasion Sense.")
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop")
  const [selectedIds, setSelectedIds] = useState<string[]>(["ps-1", "ps-2"])
  const [isPublishing, setIsPublishing] = useState(false)

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsPublishing(false)
    alert("Campaign published successfully!")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Editor Panel */}
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-2xl font-serif mb-6">Campaign Details</h2>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-[11px] uppercase tracking-widest font-bold">Campaign Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Drop"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="copy" className="text-[11px] uppercase tracking-widest font-bold">Campaign Copy</Label>
              <Textarea 
                id="copy" 
                value={copy} 
                onChange={(e) => setCopy(e.target.value)}
                placeholder="Describe your campaign..."
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image" className="text-[11px] uppercase tracking-widest font-bold">Hero Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="image" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
                <Button variant="secondary" size="icon">
                  <ImagePlus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-serif mb-6">Featured Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PRODUCTS.map((product) => (
              <div 
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`cursor-pointer border-2 transition-all p-2 ${
                  selectedIds.includes(product.id) ? "border-foreground" : "border-transparent opacity-60 grayscale"
                }`}
              >
                <div className="aspect-square relative mb-2">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                </div>
                <p className="text-[10px] font-medium truncate">{product.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-border">
          <Button variant="outline" className="flex-grow gap-2">
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button 
            className="flex-grow gap-2" 
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publish Campaign
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="sticky top-24 bg-secondary/20 p-8 border border-border">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[11px] uppercase tracking-widest font-bold opacity-50">Live Preview</h2>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
        </div>

        <div className="bg-background shadow-2xl overflow-hidden aspect-[9/16] max-w-[320px] mx-auto border border-border/50 flex flex-col no-scrollbar overflow-y-auto">
          {/* Mock App Header */}
          <div className="px-4 py-4 border-b border-border flex justify-between items-center sticky top-0 bg-background z-10">
            <span className="text-[10px] font-bold tracking-tighter">PS.</span>
            <div className="flex gap-3">
              <div className="w-3 h-3 bg-foreground/10 rounded-full" />
              <div className="w-3 h-3 bg-foreground/10 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-0 pb-12">
            <div className="aspect-[3/4] relative bg-muted">
              {imageUrl && <img src={imageUrl} alt="Preview Hero" className="object-cover w-full h-full" />}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl font-serif drop-shadow-md">{title}</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-[12px] leading-relaxed text-muted-foreground mb-8">
                {copy}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {PRODUCTS.filter(p => selectedIds.includes(p.id)).map(product => (
                  <div key={product.id} className="flex flex-col gap-2">
                    <div className="aspect-[3/4] bg-muted overflow-hidden">
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold truncate">{product.name}</h4>
                      <p className="text-[10px] opacity-60">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
