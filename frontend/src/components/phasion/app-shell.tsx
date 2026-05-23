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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2.5 px-4 text-center text-[10px] tracking-[0.25em] uppercase font-medium">
        Complimentary U.S. No-Rush Shipping on orders of $95 or more. Shop now
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Nav - Desktop */}
          <nav className="hidden lg:flex items-center gap-10 text-[11px] tracking-[0.15em] uppercase font-medium">
            <Link href="/catalog" className="hover:text-muted-foreground transition-colors">Shop</Link>
            <Link href="/catalog?filter=new" className="hover:text-muted-foreground transition-colors">New Arrivals</Link>
            <Link href="/catalog?filter=sales" className="hover:text-muted-foreground transition-colors">Sales</Link>
            <Link href="/journal" className="hover:text-muted-foreground transition-colors">Journal</Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <div className="relative h-14 w-44">
              <Image 
                src="/logo.png" 
                alt="Phasion Sense" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:bg-accent/50 transition-colors hidden sm:block">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-accent/50 transition-colors hidden sm:block">
              <MapPin className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-accent/50 transition-colors hidden sm:block">
              <Heart className="w-4 h-4" />
            </button>
            <Link href="/checkout" className="p-2 hover:bg-accent/50 transition-colors flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-tighter">(2)</span>
            </Link>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-background border-b border-border p-6 flex flex-col gap-6 text-[12px] tracking-[0.2em] uppercase font-medium animate-in fade-in slide-in-from-top-4">
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
      <footer className="bg-secondary/10 border-t border-border/40 py-24 mt-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] tracking-[0.15em] uppercase font-bold text-foreground/80">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <p className="text-[13px] text-muted-foreground hover:text-foreground cursor-default transition-colors">+1 (844) 326-6000</p>
              <p className="text-[13px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Email Us</p>
              <p className="text-[13px] text-muted-foreground hover:text-foreground cursor-default transition-colors">Mon-Fri 9am-3pm PT</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] tracking-[0.15em] uppercase font-bold text-foreground/80">Customers</h3>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Start a Return</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Return Policy</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Catalogs and Mailers</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">About Group Gifting</Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] tracking-[0.15em] uppercase font-bold text-foreground/80">Company</h3>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Sustainability</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Discover Revive</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Careers</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase font-bold text-foreground/80 mb-6">Get the latest new from us</h3>
              <div className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="bg-transparent border-b border-border py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors"
                />
                <Button variant="default" className="w-full py-6">
                  Subscribe
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-6 leading-relaxed">
                By signing up, you agree to our <Link href="#" className="underline">Privacy Policy</Link> and <Link href="#" className="underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-24 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">© Phasion Sense</p>
        </div>
      </footer>
    </div>
  )
}
