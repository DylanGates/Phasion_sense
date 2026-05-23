import Image from "next/image"
import { AppShell } from "@/components/phasion/app-shell"
import { ProductCard } from "@/components/phasion/product-card"

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
  }
]

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Campaign Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-4 drop-shadow-md">
            Weekend Shirt Edit
          </h1>
          <p className="text-[12px] uppercase tracking-[0.3em] font-bold opacity-80">
            Summer Drop 2026
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mb-24">
          <p className="text-lg md:text-xl font-medium leading-relaxed mb-8">
            A tight edit of easy shirts and two-piece sets from Phasion Sense. 
            Crafted for the modern explorer who values both style and comfort.
          </p>
          <div className="h-px w-24 bg-foreground/20" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-medium tracking-tight">Featured in this Drop</h2>
            <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">2 Items</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
