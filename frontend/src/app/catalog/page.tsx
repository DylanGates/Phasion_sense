import { AppShell } from "@/components/phasion/app-shell"
import { ProductCard } from "@/components/phasion/product-card"
import { Search, SlidersHorizontal } from "lucide-react"

const PRODUCTS = [
  {
    id: "1",
    name: "Classic Easy Zipper Tote",
    price: "$298",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Concertina Phone Bag",
    price: "$248",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Wool Cashmere Sweater Coat",
    price: "$398",
    image: "https://images.unsplash.com/photo-1539109132314-347752d87b40?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Single-Origin Cashmere Beanie",
    price: "$98",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d890e49?q=80&w=800&auto=format&fit=crop",
    colors: ["#D2B48C", "#000000", "#FFC0CB"]
  },
  {
    id: "5",
    name: "Alpaca Wool Cropped Cardigan",
    price: "$248",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Silk Blend Slip Dress",
    price: "$198",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "7",
    name: "Tailored Linen Trousers",
    price: "$178",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "8",
    name: "Oversized Cotton Poplin Shirt",
    price: "$128",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=800&auto=format&fit=crop",
  }
]

export default function CatalogPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-3xl font-serif mb-2">Shop All</h1>
            <p className="text-sm text-muted-foreground">8 Items</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 pr-4 py-2 bg-secondary/20 border-b border-transparent focus:border-foreground focus:outline-none text-sm transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-sm font-medium hover:bg-secondary/40 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-24 flex justify-center">
          <button className="px-12 py-4 border border-border text-[11px] tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300">
            Load More
          </button>
        </div>
      </div>
    </AppShell>
  )
}
