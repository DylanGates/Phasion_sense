import { AppShell } from "@/components/phasion/app-shell"
import { CampaignStudio } from "@/components/phasion/campaign-studio"

export default function StudioPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-2">Campaign Studio</h1>
          <p className="text-muted-foreground">Create and preview your curated fashion drops.</p>
        </header>

        <CampaignStudio />
      </div>
    </AppShell>
  )
}
