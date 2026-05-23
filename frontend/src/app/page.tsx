import Image from "next/image"
import Link from "next/link"
import { AppShell } from "@/components/phasion/app-shell"
import { ProductCard } from "@/components/phasion/product-card"
import { Button } from "@/components/ui/button"

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
  }
]

export default function Page() {
  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Hero"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute bottom-[15%] left-4 md:left-12 max-w-xl text-white">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight drop-shadow-sm">
            Elevate Your Style<br />
            Timeless Fashion, Sustainable Choices
          </h2>
          <Button variant="outline" className="rounded-none bg-white text-black border-white hover:bg-white/90 px-8 py-6 text-[12px] tracking-widest uppercase transition-all duration-300 transform hover:scale-105">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <p className="text-lg md:text-xl font-medium leading-relaxed tracking-tight">
          Elevate your lifestyle with a more intelligent, superior wardrobe.
          Our range is crafted sustainably with longevity in mind.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "New Arrivals", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
          { title: "The Casual Edit", img: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=800&auto=format&fit=crop" },
          { title: "Best-Sellers", img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop" }
        ].map((cat, i) => (
          <div key={i} className="group relative aspect-[4/5] overflow-hidden cursor-pointer">
            <Image
              src={cat.img}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-xl font-medium tracking-wide drop-shadow-md underline underline-offset-8 decoration-white/30">{cat.title}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Product Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-medium tracking-tight">What to Wear Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Sections */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
        <div className="group relative aspect-[4/5] overflow-hidden cursor-pointer">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
            alt="The Smart Chic"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-8 left-8">
            <h3 className="text-white text-xl font-medium tracking-wide">The Smart Chic</h3>
          </div>
        </div>
        <div className="group relative aspect-[4/5] overflow-hidden cursor-pointer">
          <Image
            src="https://images.unsplash.com/photo-1529139513466-42016c430756?q=80&w=800&auto=format&fit=crop"
            alt="Ready To Go"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-8 left-8">
            <h3 className="text-white text-xl font-medium tracking-wide">Ready To Go</h3>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-secondary/20 py-32 px-4 text-center mt-20">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <h2 className="text-2xl md:text-3xl font-serif">The Art of Fewer, Better Choices</h2>
          <p className="text-[15px] leading-loose text-muted-foreground font-medium max-w-xl mx-auto">
            Opting for quality over quantity means selecting timeless, durable, and responsibly
            made items. This approach simplifies our lives and fosters a deeper appreciation for
            our surroundings. Emphasizing longevity and responsible production resonates with a
            more sustainable and mindful lifestyle.
          </p>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-xl font-medium tracking-tight">Shop Instagram</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
          {[
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=400&auto=format&fit=crop"
          ].map((img, i) => (
            <div key={i} className="aspect-square relative overflow-hidden group">
              <Image
                src={img}
                alt={`Instagram ${i}`}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
