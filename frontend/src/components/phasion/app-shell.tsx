"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2 px-4 text-center text-[10px] tracking-widest uppercase">
        Complimentary U.S. No-Rush Shipping on orders of $95 or more. Shop now
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Nav - Desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-widest uppercase font-medium">
            <Link href="/catalog" className="hover:text-muted-foreground transition-colors">Shop</Link>
            <Link href="/catalog?filter=new" className="hover:text-muted-foreground transition-colors">New Arrivals</Link>
            <Link href="/catalog?filter=sales" className="hover:text-muted-foreground transition-colors">Sales</Link>
            <Link href="/journal" className="hover:text-muted-foreground transition-colors">Journal</Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <Image 
              src="/logo.png" 
              alt="Phasion Sense" 
              width={120} 
              height={40} 
              className="h-10 w-auto object-contain invert dark:invert-0"
              priority
            />
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-accent transition-colors hidden sm:block">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-accent transition-colors hidden sm:block">
              <MapPin className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-accent transition-colors hidden sm:block">
              <Heart className="w-4 h-4" />
            </button>
            <Link href="/checkout" className="p-2 hover:bg-accent transition-colors flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[10px] font-medium">(2)</span>
            </Link>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 text-[12px] tracking-widest uppercase font-medium animate-in fade-in slide-in-from-top-4">
            <Link href="/catalog" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link href="/catalog?filter=new" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
            <Link href="/catalog?filter=sales" onClick={() => setIsMenuOpen(false)}>Sales</Link>
            <Link href="/journal" onClick={() => setIsMenuOpen(false)}>Journal</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t border-border py-16 mt-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] tracking-widest uppercase font-bold mb-2">Contact Us</h3>
            <p className="text-[13px] text-muted-foreground">+1 (844) 326-6000</p>
            <p className="text-[13px] text-muted-foreground">Email Us</p>
            <p className="text-[13px] text-muted-foreground">Mon-Fri 9am-3pm PT</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] tracking-widest uppercase font-bold mb-2">Customers</h3>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Start a Return</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Return Policy</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">FAQ</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Catalogs and Mailers</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">About Group Gifting</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] tracking-widest uppercase font-bold mb-2">Company</h3>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">About Us</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Sustainability</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Discover Revive</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Careers</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground">Terms</Link>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-[11px] tracking-widest uppercase font-bold mb-4">Get the latest new from us</h3>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow bg-transparent border-b border-foreground/20 py-2 text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
                By signing up, you agree to our <Link href="#" className="underline">Privacy Policy</Link> and <Link href="#" className="underline">Terms of Service</Link>.
              </p>
              <Button className="mt-6 w-full rounded-none uppercase text-[11px] tracking-widest py-6" variant="default">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground">© Phasion Sense</p>
        </div>
      </footer>
    </div>
  )
}
