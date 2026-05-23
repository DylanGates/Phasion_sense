"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button className="absolute bottom-4 right-4 bg-white/90 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
          <Plus className="w-4 h-4 text-black" />
        </button>
      </div>
      <div className="flex flex-col gap-1 text-center sm:text-left px-2">
        <h3 className="text-[12px] tracking-wide font-medium">{product.name}</h3>
        <p className="text-[12px] text-muted-foreground">{product.price}</p>
        {product.colors && (
          <div className="flex gap-2 mt-1 justify-center sm:justify-start">
            {product.colors.map((color, i) => (
              <div 
                key={i} 
                className="w-2.5 h-2.5 rounded-full border border-black/10" 
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
