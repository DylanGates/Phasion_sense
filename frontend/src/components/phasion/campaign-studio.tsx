"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, Wand2, ImageOff, Send, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Product = { id: string; name: string; price: string; image: string }

type Step = "select" | "stage" | "generate" | "done"

const TEAM_SLUG = "phasion-sense"
const MERCHANT_ID = "phasion-sense"

export function CampaignStudio({ products }: { products: Product[] }) {
  const [step, setStep] = useState<Step>("select")

  // Step 1 — product selection
  const [selected, setSelected] = useState<Product | null>(null)

  // Step 2 — Photoroom staging
  const [staging, setStaging] = useState(false)
  const [stagedUrl, setStagedUrl] = useState<string | null>(null)

  // Step 3 — Predis.ai generation + publish
  const [title, setTitle] = useState("")
  const [copy, setCopy] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generatedCard, setGeneratedCard] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishedId, setPublishedId] = useState<string | null>(null)

  // ── Step 1: pick a product ────────────────────────────────────────────────
  function pickProduct(p: Product) {
    setSelected(p)
    setTitle(p.name)
    setCopy(`Shop the ${p.name} — a signature piece from Phasion Sense, crafted for the modern wardrobe.`)
    setStagedUrl(null)
    setGeneratedCard(null)
    setPublishedId(null)
    setStep("stage")
  }

  // ── Step 2: Photoroom background removal ──────────────────────────────────
  async function removeBackground() {
    if (!selected) return
    setStaging(true)
    try {
      const res = await fetch("/api/pipeline/stage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageUrl: selected.image }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Stage failed")
      setStagedUrl(data.stagedImageUrl)
      toast.success("Background removed!")
    } catch (e: any) {
      toast.error(e.message ?? "Photoroom failed")
    } finally {
      setStaging(false)
    }
  }

  // ── Step 3: Predis.ai campaign card ───────────────────────────────────────
  async function generateCard() {
    if (!selected) return
    const imageUrl = stagedUrl ?? selected.image
    setGenerating(true)
    try {
      const res = await fetch("/api/pipeline/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageUrl, productName: title || selected.name, copyHint: copy }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Generate failed")
      setGeneratedCard(data.imageUrl ?? data.postUrl ?? null)
      setStep("generate")
      toast.success("Campaign card generated!")
    } catch (e: any) {
      toast.error(e.message ?? "Predis.ai failed")
    } finally {
      setGenerating(false)
    }
  }

  // ── Publish campaign to hackathon API ─────────────────────────────────────
  async function publish() {
    if (!selected) return
    setPublishing(true)
    try {
      const body = {
        merchant_id: MERCHANT_ID,
        title,
        copy_text: copy,
        featured_item_ids: [selected.id],
        team_slug: TEAM_SLUG,
        ...(generatedCard ? { image_urls: [generatedCard] } : stagedUrl ? { image_urls: [stagedUrl] } : {}),
      }
      const res = await fetch("https://api-hackathon.codedematrixtech.com/campaigns", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Publish failed")
      setPublishedId(data.id)
      setStep("done")
      toast.success(`Campaign published! ID: ${data.id}`)
    } catch (e: any) {
      toast.error(e.message ?? "Publish failed")
    } finally {
      setPublishing(false)
    }
  }

  // ── Restart ───────────────────────────────────────────────────────────────
  function restart() {
    setSelected(null)
    setStagedUrl(null)
    setGeneratedCard(null)
    setPublishedId(null)
    setTitle("")
    setCopy("")
    setStep("select")
  }

  // ── Step indicator ────────────────────────────────────────────────────────
  const steps = [
    { key: "select",   label: "Select Product" },
    { key: "stage",    label: "Remove Background" },
    { key: "generate", label: "Generate Card" },
    { key: "done",     label: "Published" },
  ]
  const stepIdx = steps.findIndex(s => s.key === step)

  return (
    <div className="space-y-12">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold transition-colors ${i <= stepIdx ? "text-foreground" : "text-muted-foreground/40"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${i < stepIdx ? "bg-foreground text-background border-foreground" : i === stepIdx ? "border-foreground text-foreground" : "border-muted-foreground/30 text-muted-foreground/30"}`}>
                {i < stepIdx ? "✓" : i + 1}
              </span>
              {s.label}
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/30" />}
          </div>
        ))}
      </div>

      {/* ── Step 1: Product grid ── */}
      {step === "select" && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest mb-8 opacity-70">Choose a Product</h2>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-sm">No products loaded. Check your API connection.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pickProduct(p)}
                  className="group text-left hover:opacity-90 transition-opacity"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-secondary/30 mb-3 border border-border/50 group-hover:border-foreground/30 transition-colors">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageOff className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.price}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2 + 3: Edit panel + preview ── */}
      {(step === "stage" || step === "generate") && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: controls */}
          <div className="space-y-10">

            {/* Selected product */}
            <div>
              <p className="text-[11px] uppercase tracking-widest font-bold opacity-40 mb-4">Selected Product</p>
              <div className="flex items-start gap-4">
                <div className="w-20 aspect-[3/4] relative border border-border/50 overflow-hidden shrink-0">
                  {selected.image && <Image src={selected.image} alt={selected.name} fill className="object-cover" unoptimized />}
                </div>
                <div>
                  <p className="font-bold">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{selected.price}</p>
                  <button onClick={restart} className="text-xs underline text-muted-foreground mt-2 hover:text-foreground">
                    Change product
                  </button>
                </div>
              </div>
            </div>

            {/* Photoroom */}
            <div className="border border-border/50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Step 1 — Photoroom</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Remove the product background with AI</p>
                </div>
                {stagedUrl && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
              </div>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={removeBackground}
                disabled={staging}
              >
                {staging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {staging ? "Removing background…" : stagedUrl ? "Remove Again" : "Remove Background"}
              </Button>
            </div>

            {/* Campaign details */}
            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-widest font-bold opacity-40">Campaign Details</p>
              <div className="grid gap-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold">Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Weekend Drop" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold">Copy</Label>
                <Textarea value={copy} onChange={e => setCopy(e.target.value)} rows={3} placeholder="Describe your campaign…" />
              </div>
            </div>

            {/* Predis */}
            <div className="border border-border/50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Step 2 — Predis.ai</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Generate a social media campaign card</p>
                </div>
                {generatedCard && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
              </div>
              <Button
                className="w-full gap-2"
                onClick={generateCard}
                disabled={generating}
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {generating ? "Generating…" : generatedCard ? "Regenerate Card" : "Generate Campaign Card"}
              </Button>
            </div>

            {/* Publish */}
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={publish}
              disabled={publishing}
            >
              {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {publishing ? "Publishing…" : "Publish Campaign"}
            </Button>
          </div>

          {/* Right: preview */}
          <div className="sticky top-24 space-y-4">
            <p className="text-[11px] uppercase tracking-widest font-bold opacity-40">Preview</p>

            {/* Generated card */}
            {generatedCard && (
              <div className="border border-border/50 overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 px-4 pt-3 pb-2">Generated Campaign Card</p>
                <div className="aspect-square relative bg-secondary/20">
                  <Image src={generatedCard} alt="Generated campaign" fill className="object-contain" unoptimized />
                </div>
              </div>
            )}

            {/* Staged / original */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border/50 overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 px-3 pt-2 pb-1">Original</p>
                <div className="aspect-[3/4] relative bg-secondary/20">
                  {selected.image && <Image src={selected.image} alt="Original" fill className="object-cover" unoptimized />}
                </div>
              </div>
              <div className="border border-border/50 overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 px-3 pt-2 pb-1">
                  {stagedUrl ? "Background Removed" : "After Photoroom"}
                </p>
                <div className="aspect-[3/4] relative bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)_0_0/16px_16px]">
                  {stagedUrl ? (
                    <Image src={stagedUrl} alt="Staged" fill className="object-contain" unoptimized />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                      Run Photoroom
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign card text preview */}
            <div className="border border-border/50 p-5 space-y-1">
              <p className="font-bold text-sm">{title || selected.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{copy}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Done ── */}
      {step === "done" && (
        <div className="max-w-lg mx-auto text-center py-24 space-y-6">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <h2 className="text-2xl font-serif">Campaign Published</h2>
          {publishedId && <p className="text-sm text-muted-foreground font-mono">ID: {publishedId}</p>}
          <p className="text-muted-foreground text-sm">
            Your campaign is now live and visible to your customers.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button variant="outline" onClick={restart}>Create Another</Button>
            <Button onClick={() => window.open(`https://api-hackathon.codedematrixtech.com/campaigns/${publishedId}`, "_blank")}>
              View Campaign
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
