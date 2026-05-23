import Image from "next/image"
import Link from "next/link"
import { AppShell } from "@/components/phasion/app-shell"
import { ProductCard } from "@/components/phasion/product-card"
import { Button } from "@/components/ui/button"

const heroImg = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2400&auto=format&fit=crop"

const categoryItems = [
  { title: "New Arrivals",    img: "https://images.unsplash.com/photo-1539109132314-347752d87b40?q=80&w=800&auto=format&fit=crop" },
  { title: "The Casual Edit", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
  { title: "Best-Sellers",    img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop" },
]

const productGrid = [
  { id: "1", name: "Linen Oversized Blazer", price: "GH₵520.00", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b5491?q=80&w=800&auto=format&fit=crop" },
  { id: "2", name: "Ribbed Knit Midi Dress", price: "GH₵380.00", image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=800&auto=format&fit=crop" },
  { id: "3", name: "Wide-Leg Trousers",      price: "GH₵290.00", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop" },
  { id: "4", name: "Silk Slip Cami Top",     price: "GH₵180.00", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop" },
  { id: "5", name: "Structured Tote Bag",    price: "GH₵420.00", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
]

const igImages = [
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139513466-42016c430756?q=80&w=600&auto=format&fit=crop",
]

export default function Page() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative h-[92vh] w-full overflow-hidden">
        <Image src={heroImg} alt="Hero" fill priority className="object-cover object-top" />
        <div className="absolute inset-0 bg-black/[0.03]" />
        <div className="absolute bottom-[20%] left-6 md:left-16 lg:left-24 max-w-2xl text-white font-serif">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-10 leading-[1.1] tracking-tight drop-shadow-sm">
            Elevate Your Style<br />
            Timeless Fashion,<br />Sustainable Choices
          </h2>
          <Button variant="hero" size="lg" className="px-10 py-7">
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
              <h3 className="text-white text-2xl font-serif font-medium tracking-wide drop-shadow-lg underline underline-offset-[12px] decoration-white/40">
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
            <h2 className="text-xl font-bold tracking-[0.05em] uppercase opacity-90 font-sans">What to Wear Now</h2>
            <Link href="/catalog" className="text-xs tracking-widest uppercase underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity font-sans">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-20">
            {productGrid.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle pair */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 py-12">
        <Link href="/catalog" className="group relative aspect-[3/4] overflow-hidden block">
          <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop" alt="The Smart Chic" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute bottom-10 left-10 text-white font-serif">
            <h3 className="text-2xl font-medium tracking-wide drop-shadow-md">The Smart Chic</h3>
          </div>
        </Link>
        <Link href="/catalog" className="group relative aspect-[3/4] overflow-hidden block">
          <Image src="https://images.unsplash.com/photo-1529139513466-42016c430756?q=80&w=1200&auto=format&fit=crop" alt="Ready To Go" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute bottom-10 left-10 text-white font-serif">
            <h3 className="text-2xl font-medium tracking-wide drop-shadow-md">Ready To Go</h3>
          </div>
        </Link>
      </section>

      {/* Mission */}
      <section className="bg-secondary/20 py-48 px-6 text-center mt-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-12 font-sans">
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
          <h2 className="text-xl font-bold tracking-[0.05em] uppercase opacity-90 font-sans">Shop Instagram</h2>
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
