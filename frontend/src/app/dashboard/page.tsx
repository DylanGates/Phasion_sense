import { AppShell } from "@/components/phasion/app-shell"
import { BarChart3, MessageSquare, Package, Users, ArrowUpRight } from "lucide-react"

const STATS = [
  { label: "Active Campaigns", value: "2", icon: Package, trend: "+1 this week" },
  { label: "Total Baskets", value: "14", icon: MessageSquare, trend: "+3 since yesterday" },
  { label: "Total Revenue", value: "$4,280", icon: BarChart3, trend: "+12% vs last month" },
  { label: "Team Members", value: "5", icon: Users, trend: "Full team active" }
]

const RECENT_ACTIVITY = [
  { type: "Campaign Published", title: "Weekend Shirt Edit", time: "2 hours ago" },
  { type: "New Order", title: "Basket #8291", time: "5 hours ago" },
  { type: "New Order", title: "Basket #8290", time: "1 day ago" },
  { type: "Campaign Published", title: "Summer Essentials", time: "2 days ago" }
]

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">Command center for Phasion Sense team.</p>
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20">Team a5 Active</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-secondary/20 p-8 border border-border">
              <div className="flex justify-between items-start mb-6">
                <stat.icon className="w-5 h-5 opacity-40" />
                <span className="text-[10px] font-bold text-green-600">{stat.trend}</span>
              </div>
              <h3 className="text-[11px] uppercase tracking-widest font-bold opacity-50 mb-1">{stat.label}</h3>
              <p className="text-3xl font-serif">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif">Recent Activity</h2>
              <button className="text-[11px] uppercase tracking-widest font-bold hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-4">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-6 border border-border hover:bg-secondary/10 transition-colors group cursor-pointer">
                  <div className="flex gap-6 items-center">
                    <div className="w-2 h-2 rounded-full bg-foreground/20 group-hover:bg-foreground transition-colors" />
                    <div>
                      <h4 className="text-sm font-medium">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-serif mb-8">Quick Actions</h2>
            <div className="flex flex-col gap-4">
              <button className="w-full p-6 text-left border border-border hover:bg-foreground hover:text-background transition-all group">
                <h4 className="text-[11px] uppercase tracking-widest font-bold mb-1">Storefront</h4>
                <p className="text-sm opacity-60">Create new campaign drop</p>
              </button>
              <button className="w-full p-6 text-left border border-border hover:bg-foreground hover:text-background transition-all group">
                <h4 className="text-[11px] uppercase tracking-widest font-bold mb-1">Inventory</h4>
                <p className="text-sm opacity-60">Update product stock</p>
              </button>
              <button className="w-full p-6 text-left border border-border hover:bg-foreground hover:text-background transition-all group">
                <h4 className="text-[11px] uppercase tracking-widest font-bold mb-1">Insights</h4>
                <p className="text-sm opacity-60">View detailed sales report</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
