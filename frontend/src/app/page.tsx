import Image from "next/image"
import Link from "next/link"
import { AppShell } from "@/components/phasion/app-shell"
import { ProductCard } from "@/components/phasion/product-card"
import { Button } from "@/components/ui/button"
import { phasionApi } from "@/lib/phasion/api"

const FALLBACK_HERO = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2400&auto=format&fit=crop"
const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139513466-42016c430756?q=80&w=1200&auto=format&fit=crop",
]

export const revalidate = 60

export default async function Page() {
  const [items, campaigns] = await Promise.all([
    phasionApi.getItems().catch(() => []),
    phasionApi.getCampaigns().catch(() => []),
  ])

  const heroImg =
    campaigns[0]?.image_urls?.[0] ??
    items[0]?.image_urls?.[0] ??
    FALLBACK_HERO

  const categoryItems = [
    { title: "New Arrivals",    img: campaigns[0]?.image_urls?.[0] ?? FALLBACK_IMGS[0] },
    { title: "The Casual Edit", img: campaigns[1]?.image_urls?.[0] ?? FALLBACK_IMGS[1] },
    { title: "Best-Sellers",    img: campaigns[2]?.image_urls?.[0] ?? FALLBACK_IMGS[2] },
  ]

  const productGrid = items.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    price: `GH₵${(p.price_minor / 100).toFixed(2)}`,
    image: p.image_urls?.[0] ?? FALLBACK_IMGS[0],
  }))

  const lifestyleLeft  = items[5]?.image_urls?.[0] ?? FALLBACK_IMGS[3]
  const lifestyleRight = items[6]?.image_urls?.[0] ?? FALLBACK_IMGS[4]

  const igImages = Array.from({ length: 5 }, (_, i) => {
    return items[i + 1]?.image_urls?.[0] ?? FALLBACK_IMGS[i % 3]
  })

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative h-[92vh] w-full overflow-hidden">
        <Image src={heroImg} alt="Hero" fill priority className="object-cover object-top" />
        <div className="absolute inset-0 bg-black/[0.03]" />
        <div className="absolute bottom-[20%] left-6 md:left-16 lg:left-24 max-w-2xl text-white">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light mb-10 leading-[1.1] tracking-tight drop-shadow-sm">
            Elevate Your Style<br />
            Timeless Fashion,<br />Sustainable Choices
          </h2>
          <Button variant="outline" size="lg" className="rounded-none bg-white text-black border-white hover:bg-white/90 px-10 py-7 text-xs tracking-widest uppercase">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Intro */}
      <section className="py-32 px-6 max-w-5xl mx-auto text-center">
        <p className="text-xl md:text-2xl font-light leading-relaxed tracking-tight text-foreground/80">
          Elevate your lifestyle with a more intelligent, superior wardrobe.<br className="hidden md:block" />
          Our range is crafted sustainably with longevity in mind.
        </p>
      </section>

      {/* Category Grid */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {categoryItems.map((cat, i) => (
          <Link key={i} href="/catalog" className="group relative aspect-[3/4] overflow-hidden block">
            <Image
              src={cat.img}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/15 transition-opacity group-hover:opacity-0" />
            <div className="absolute bottom-10 left-10">
              <h3 className="text-white text-2xl font-medium tracking-wide drop-shadow-lg underline underline-offset-[12px] decoration-white/40">
                {cat.title}
              </h3>
            </div>
          </Link>
        ))}
      </section>

      {/* Products */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-xl font-bold tracking-[0.05em] uppercase opacity-90">What to Wear Now</h2>
            <Link href="/catalog" className="text-xs tracking-widest uppercase underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity">
              View All
            </Link>
          </div>
          {productGrid.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-20">
              {productGrid.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No products found.</p>
          )}
        </div>
      </section>

      {/* Lifestyle pair */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 py-12">
        <Link href="/catalog" className="group relative aspect-[3/4] overflow-hidden block">
          <Image src={lifestyleLeft} alt="The Smart Chic" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute bottom-10 left-10">
            <h3 className="text-white text-2xl font-medium tracking-wide drop-shadow-md">The Smart Chic</h3>
          </div>
        </Link>
        <Link href="/catalog" className="group relative aspect-[3/4] overflow-hidden block">
          <Image src={lifestyleRight} alt="Ready To Go" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute bottom-10 left-10">
            <h3 className="text-white text-2xl font-medium tracking-wide drop-shadow-md">Ready To Go</h3>
          </div>
        </Link>
      </section>

      {/* Mission */}
      <section className="bg-secondary/5 py-48 px-6 text-center mt-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight">The Art of Fewer, Better Choices</h2>
          <p className="text-[17px] leading-[2] text-muted-foreground font-medium max-w-2xl mx-auto px-4">
            Opting for quality over quantity means selecting timeless, durable, and responsibly
            made items. This approach simplifies our lives and fosters a deeper appreciation for
            our surroundings. Emphasizing longevity and responsible production resonates with a
            more sustainable and mindful lifestyle.
          </p>
        </div>
      </section>

      {/* Instagram grid */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-xl font-bold tracking-[0.05em] uppercase opacity-90">Shop Instagram</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6">
          {igImages.map((img, i) => (
            <div key={i} className="aspect-square relative overflow-hidden group border border-border/10">
              <Image
                src={img}
                alt={`Look ${i + 1}`}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 cursor-pointer hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
