"use client"

import Link from "next/link"
import Image from "next/image"
import type { Pitch, User } from "@/lib/types"
import { BarChart3, Heart, MessageCircle, Share2 } from "lucide-react"
import { useState } from "react"

interface StartupCardProps {
  pitch: Pitch
  user: User | null
}

export function StartupCard({ pitch, user }: StartupCardProps) {
  const showAnalytics = user && (user.role === "investor" || user.role === "incubator")
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(pitch.likes || 0)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image container - responsive height */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 bg-muted flex items-center justify-center overflow-hidden">
        {pitch.image ? (
          <Image
            src={pitch.image || "/placeholder.svg"}
            alt={pitch.startup}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <video src={pitch.video} className="w-full h-full object-cover" preload="metadata" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content - responsive padding */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Title and founder */}
        <div>
          <h3 className="font-semibold text-foreground text-base sm:text-lg line-clamp-1">{pitch.startup}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{pitch.founder}</p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-foreground line-clamp-2">{pitch.description}</p>

        {/* Tags - responsive text size and CHANGE: improved visibility with better colors */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full font-medium">
            {pitch.stage}
          </span>
          <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full font-medium">
            {pitch.category}
          </span>
          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full font-medium line-clamp-1">
            {pitch.place}
          </span>
        </div>

        {/* Engagement metrics */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{pitch.comments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{Math.floor((pitch.likes || 0) * 0.3)}</span>
          </div>
        </div>

        {/* Action buttons - removed text labels, kept only icons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center p-2 sm:p-2.5 rounded-lg font-medium transition-all ${
              isLiked
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-muted text-foreground hover:bg-accent/10"
            }`}
            title="Like"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button
            className="flex-1 flex items-center justify-center p-2 sm:p-2.5 rounded-lg font-medium bg-muted text-foreground hover:bg-accent/10 transition-all"
            title="Comment"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            className="flex-1 flex items-center justify-center p-2 sm:p-2.5 rounded-lg font-medium bg-muted text-foreground hover:bg-accent/10 transition-all"
            title="Share"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Analytics button for investors/incubators */}
        {showAnalytics && (
          <Link
            href={`/analytics?startupId=${pitch.id}`}
            className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Link>
        )}
      </div>
    </div>
  )
}
