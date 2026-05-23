"use client"

import Image from "next/image"
import { Plus } from "lucide-react"

interface Product {
  id: string
  name: string
  price: string
  image: string
  colors?: string[]
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-6">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        <button className="absolute bottom-4 right-4 bg-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 shadow-sm">
          <Plus className="w-4 h-4 text-black stroke-[1.5]" />
        </button>
      </div>
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="text-[11px] tracking-[0.05em] uppercase font-bold text-foreground/90">{product.name}</h3>
        <p className="text-[12px] text-muted-foreground font-medium">{product.price}</p>
        {product.colors && (
          <div className="flex gap-2.5 mt-2">
            {product.colors.map((color, i) => (
              <div 
                key={i} 
                className="w-3 h-3 rounded-full border border-black/5" 
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
