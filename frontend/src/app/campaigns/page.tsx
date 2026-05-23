import { AppShell } from "@/components/phasion/app-shell"
import { CampaignCard } from "@/components/phasion/campaign-card"

const CAMPAIGNS = [
  {
    id: "1",
    title: "Weekend Shirt Edit",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
    date: "May 24, 2026"
  },
  {
    id: "2",
    title: "Summer Essentials",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop",
    date: "June 02, 2026"
  }
]

export default function CampaignsPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-serif mb-4">Campaigns</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our curated drops and exclusive fashion edits. 
            Each campaign is a celebration of style and craftsmanship.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {CAMPAIGNS.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
