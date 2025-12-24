"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { Pitch, User } from "@/lib/types"
import { localStorage_utils } from "@/lib/localStorage"
import { ReelPlayer } from "@/components/reel-player"
import { Navbar } from "@/components/navbar"
import { CommentModal } from "@/components/comment-modal"
import { ScheduleMeetModal } from "@/components/schedule-meet-modal"
import { AIDecisionPanel } from "@/components/ai-decision-panel"

export default function FeedPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null)
  const [meetPitch, setMeetPitch] = useState<Pitch | null>(null)
  const [aiPitch, setAiPitch] = useState<Pitch | null>(null) // Added AI analysis state
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = localStorage_utils.getUser()
    if (!currentUser) {
      router.push("/welcome")
      return
    }
    setUser(currentUser)

    // Get videos from localStorage or use sample data
    const videos = localStorage_utils.getVideos()
    setPitches(videos)
  }, [router])

  // Intersection Observer for auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setActiveIndex(index)
          }
        })
      },
      { threshold: 0.5 },
    )

    const elements = containerRef.current?.querySelectorAll("[data-index]")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [pitches])

  if (!user) return null

  return (
    <div className="relative">
      {/* Reels container */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {pitches.map((pitch, index) => (
          <div key={pitch.id} data-index={index}>
            <ReelPlayer
              pitch={pitch}
              isActive={activeIndex === index}
              userId={user.id}
              user={user}
              onCommentClick={setSelectedPitch}
              onScheduleMeetClick={setMeetPitch}
              onAIAnalysisClick={setAiPitch} // Added AI analysis handler
            />
          </div>
        ))}
      </div>

      <Navbar user={user} />

      {/* Comment Modal */}
      <CommentModal
        pitch={selectedPitch}
        userId={user.id}
        userName={user.name}
        onClose={() => setSelectedPitch(null)}
      />

      {/* Schedule Meet Modal */}
      <ScheduleMeetModal pitch={meetPitch} user={user} onClose={() => setMeetPitch(null)} />

      <AIDecisionPanel pitch={aiPitch} user={user!} isOpen={!!aiPitch} onClose={() => setAiPitch(null)} />
    </div>
  )
}
