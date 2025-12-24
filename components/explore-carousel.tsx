"use client"

import { useRef } from "react"
import type { Pitch, User } from "@/lib/types"
import { StartupCard } from "./startup-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ExploreCarouselProps {
  title: string
  pitches: Pitch[]
  user: User | null
}

export function ExploreCarousel({ title, pitches, user }: ExploreCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground px-4">{title}</h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 pb-2 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {pitches.map((pitch) => (
            <div key={pitch.id} className={`flex-shrink-0 w-72 snap-start ${pitch.startup === "StudyMate" ? "" : ""}`}>
              <StartupCard pitch={pitch} user={user} />
            </div>
          ))}
        </div>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  )
}
