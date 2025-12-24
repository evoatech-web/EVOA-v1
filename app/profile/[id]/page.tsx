"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { User, Pitch } from "@/lib/types"
import { localStorage_utils } from "@/lib/localStorage"
import { Navbar } from "@/components/navbar"
import { StartupCard } from "@/components/startup-card"
import { LogOut, RotateCcw } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [likedPitches, setLikedPitches] = useState<Pitch[]>([])
  const [allPitches, setAllPitches] = useState<Pitch[]>([])

  useEffect(() => {
    const currentUser = localStorage_utils.getUser()
    if (!currentUser) {
      router.push("/welcome")
      return
    }

    // Only allow viewing own profile
    if (params.id !== "me") {
      router.push("/profile/me")
      return
    }

    setUser(currentUser)

    // Get all pitches and filter liked ones
    const pitches = localStorage_utils.getVideos()
    setAllPitches(pitches)

    const userLikes = localStorage_utils.getLikes()[currentUser.id] || []
    const liked = pitches.filter((p) => userLikes.includes(p.id))
    setLikedPitches(liked)
  }, [router, params.id])

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage_utils.clearUser()
      router.push("/welcome")
    }
  }

  const handleReset = () => {
    if (confirm("This will clear all your data. Are you sure?")) {
      localStorage_utils.clearAll()
      router.push("/welcome")
    }
  }

  if (!user) return null

  return (
    <div className="pb-20">
      {/* Header - responsive padding */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b border-border">
        <div className="p-4 sm:p-6 space-y-4">
          {/* Profile info */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-semibold capitalize">
                {user.role}
              </span>
            </div>
          </div>

          {/* Role-specific info */}
          {user.role === "startup" && (
            <div className="bg-card rounded-lg border border-border p-3 sm:p-4 space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{user.meta.startupName}</span> • {user.meta.stage}
              </p>
              <p className="text-xs sm:text-sm text-foreground">{user.meta.pitchDescription}</p>
            </div>
          )}

          {user.role === "investor" && (
            <div className="bg-card rounded-lg border border-border p-3 sm:p-4 space-y-2">
              <p className="text-xs sm:text-sm text-foreground">
                <span className="font-semibold">{user.meta.designation}</span> • {user.meta.investorType}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Ticket Size: {user.meta.ticketSize}</p>
            </div>
          )}

          {user.role === "incubator" && (
            <div className="bg-card rounded-lg border border-border p-3 sm:p-4 space-y-2">
              <p className="text-xs sm:text-sm text-foreground font-semibold">{user.meta.institutionName}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{user.meta.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content - responsive spacing */}
      <div className="p-3 sm:p-4 space-y-6 sm:space-y-8">
        {/* Liked videos section */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">Liked Pitches ({likedPitches.length})</h2>
          {likedPitches.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No liked pitches yet. Start exploring!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {likedPitches.map((pitch) => (
                <StartupCard key={pitch.id} pitch={pitch} user={user} />
              ))}
            </div>
          )}
        </div>

        {/* Actions - responsive button sizing */}
        <div className="space-y-2 sm:space-y-3 pt-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm sm:text-base"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            Logout
          </button>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-3 bg-destructive/10 text-destructive rounded-lg font-semibold hover:bg-destructive/20 transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            Reset All Data
          </button>
        </div>
      </div>

      {/* Navbar */}
      <Navbar />
    </div>
  )
}
