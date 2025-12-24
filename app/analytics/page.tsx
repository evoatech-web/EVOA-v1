"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { User, Pitch } from "@/lib/types"
import { localStorage_utils } from "@/lib/localStorage"
import { sampleAnalytics, samplePitches } from "@/lib/sample-data"
import { Navbar } from "@/components/navbar"
import { MetricCard } from "@/components/metric-card"
import { ArrowLeft, TrendingUp, MessageSquare, Share2, Eye } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const startupId = searchParams.get("startupId")

  const [user, setUser] = useState<User | null>(null)
  const [pitch, setPitch] = useState<Pitch | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage_utils.getUser()
    if (!currentUser) {
      router.push("/welcome")
      return
    }

    // Check if user has access to analytics
    if (currentUser.role !== "investor" && currentUser.role !== "incubator") {
      router.push("/feed")
      return
    }

    setUser(currentUser)

    // Get pitch and analytics data
    if (startupId) {
      const foundPitch = samplePitches.find((p) => p.id === startupId)
      setPitch(foundPitch || null)

      const analyticsData = sampleAnalytics[startupId]
      setAnalytics(analyticsData || null)
    }
  }, [router, startupId])

  if (!user || !pitch || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="p-4 flex items-center gap-4">
          <Link href="/explore" className="text-primary hover:text-primary-dark transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{pitch.startup}</h1>
            <p className="text-sm text-muted-foreground">{pitch.founder}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-8">
        {/* Engagement metrics */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Engagement</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Views" value={analytics.views.toLocaleString()} icon={<Eye className="h-5 w-5" />} />
            <MetricCard
              label="Likes"
              value={analytics.likes.toLocaleString()}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <MetricCard
              label="Comments"
              value={analytics.comments.toLocaleString()}
              icon={<MessageSquare className="h-5 w-5" />}
            />
            <MetricCard
              label="Shares"
              value={analytics.shares.toLocaleString()}
              icon={<Share2 className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Traction */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Traction to Date</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Active Users"
              value={analytics.traction.users.toLocaleString()}
              description="Current user base"
            />
            <MetricCard label="Revenue" value={analytics.traction.revenue} description="Annual recurring revenue" />
            <MetricCard
              label="Growth Rate"
              value={`${analytics.traction.growth}%`}
              description="Month-over-month growth"
            />
          </div>
        </div>

        {/* Market sizing */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Market Sizing</h2>
          <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">TAM (Total Addressable Market)</p>
                <p className="text-3xl font-bold text-foreground">{analytics.metrics.tam}</p>
                <p className="text-xs text-muted-foreground mt-2">Total market opportunity</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">SAM (Serviceable Addressable Market)</p>
                <p className="text-3xl font-bold text-foreground">{analytics.metrics.sam}</p>
                <p className="text-xs text-muted-foreground mt-2">Realistic market segment</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">SOM (Serviceable Obtainable Market)</p>
                <p className="text-3xl font-bold text-foreground">{analytics.metrics.som}</p>
                <p className="text-xs text-muted-foreground mt-2">Achievable market share</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial metrics */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Financial Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Runway" value={analytics.metrics.runway} description="Months of operation" />
            <MetricCard label="Monthly Burn" value={analytics.metrics.monthlyBurn} description="Monthly expenses" />
            <MetricCard label="ARR" value={analytics.metrics.arr} description="Annual recurring revenue" />
            <MetricCard label="CAC" value={analytics.metrics.cac} description="Customer acquisition cost" />
            <MetricCard label="LTV" value={analytics.metrics.ltv} description="Lifetime value per customer" />
          </div>
        </div>

        {/* Pitch deck section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Pitch Deck</h2>
          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <p className="text-muted-foreground mb-4">Pitch deck available for download</p>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition-colors">
              Download Deck
            </button>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <Navbar />
    </div>
  )
}
