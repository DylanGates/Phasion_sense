"use client"

import Link from "next/link"
import Image from "next/image"

interface Campaign {
  id: string
  title: string
  image: string
  date: string
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link href={`/campaigns/${campaign.id}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted mb-4">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-6 left-6">
          <h3 className="text-white text-xl font-serif drop-shadow-md">{campaign.title}</h3>
        </div>
      </div>
      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold opacity-60">
        <span>Curated Drop</span>
        <span>{campaign.date}</span>
      </div>
    </Link>
  )
}
