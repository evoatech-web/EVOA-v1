"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { Pitch, User } from "@/lib/types"
import { localStorage_utils } from "@/lib/localStorage"
import { Navbar } from "@/components/navbar"
import { ExploreCarousel } from "@/components/explore-carousel"
import { StartupCard } from "@/components/startup-card"
import { Search, X } from "lucide-react"

export default function ExplorePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = localStorage_utils.getUser()
    if (!currentUser) {
      router.push("/welcome")
      return
    }
    setUser(currentUser)
    setPitches(localStorage_utils.getVideos())
  }, [router])

  // Filter pitches based on search and filters
  const filteredPitches = useMemo(() => {
    return pitches.filter((pitch) => {
      const matchesSearch =
        pitch.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStage = !selectedStage || pitch.stage === selectedStage
      const matchesCategory = !selectedCategory || pitch.category === selectedCategory

      return matchesSearch && matchesStage && matchesCategory
    })
  }, [pitches, searchQuery, selectedStage, selectedCategory])

  // Get unique categories and stages
  const categories = useMemo(() => [...new Set(pitches.map((p) => p.category))], [pitches])
  const stages = useMemo(() => [...new Set(pitches.map((p) => p.stage))], [pitches])

  // Organize pitches by category for carousels
  const pitchesByCategory = useMemo(() => {
    const grouped: Record<string, Pitch[]> = {}
    pitches.forEach((pitch) => {
      if (!grouped[pitch.category]) grouped[pitch.category] = []
      grouped[pitch.category].push(pitch)
    })
    return grouped
  }, [pitches])

  if (!user) return null

  return (
    <div className="pb-20">
      {/* Header - responsive padding */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Explore</h1>

          {/* Search bar - CHANGE: now searches by stage, category, and startup name */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search startups, founders, stage, category..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-muted rounded-lg text-sm sm:text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters - CHANGE: added "All" option and made it default selected */}
          <div className="space-y-2 sm:space-y-3">
            {/* Stage filter */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Stage</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStage(null)}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedStage === null
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-muted text-foreground hover:bg-accent/10"
                  }`}
                >
                  All
                </button>
                {stages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(selectedStage === stage ? null : stage)}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedStage === stage
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-muted text-foreground hover:bg-accent/10"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === null
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-muted text-foreground hover:bg-accent/10"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-muted text-foreground hover:bg-accent/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {(selectedStage || selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedStage(null)
                  setSelectedCategory(null)
                }}
                className="flex items-center gap-2 text-xs sm:text-sm text-primary hover:text-primary-dark transition-colors"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content - responsive spacing */}
      <div className="space-y-6 sm:space-y-8 p-3 sm:p-4">
        {(selectedStage || selectedCategory) && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              Filtered Results ({filteredPitches.length})
            </h2>
            {filteredPitches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No startups match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredPitches.map((pitch) => (
                  <StartupCard key={pitch.id} pitch={pitch} user={user} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trending startups carousel - only show when no filters */}
        {!selectedStage && !selectedCategory && (
          <>
            <ExploreCarousel
              title="Trending Startups"
              pitches={pitches.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)}
              user={user}
            />

            {/* Category carousels */}
            {Object.entries(pitchesByCategory).map(([category, categoryPitches]) => (
              <ExploreCarousel key={category} title={category} pitches={categoryPitches} user={user} />
            ))}
          </>
        )}

        {/* Search results grid */}
        {searchQuery && !selectedStage && !selectedCategory && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Search Results</h2>
            {filteredPitches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No startups found matching your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredPitches.map((pitch) => (
                  <StartupCard key={pitch.id} pitch={pitch} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navbar */}
      <Navbar />
    </div>
  )
}
