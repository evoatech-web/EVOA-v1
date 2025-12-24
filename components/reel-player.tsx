"use client"

import { useEffect, useRef, useState } from "react"
import type { Pitch, User } from "@/lib/types"
import { Heart, MessageCircle, Share2, Bookmark, Calendar, Sparkles } from "lucide-react"
import { localStorage_utils } from "@/lib/localStorage"

interface ReelPlayerProps {
  pitch: Pitch
  isActive: boolean
  userId: string
  user: User | null
  onCommentClick: (pitch: Pitch) => void
  onScheduleMeetClick: (pitch: Pitch) => void
  onAIAnalysisClick: (pitch: Pitch) => void // Added AI analysis callback
}

export function ReelPlayer({
  pitch,
  isActive,
  userId,
  user,
  onCommentClick,
  onScheduleMeetClick,
  onAIAnalysisClick,
}: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(pitch.likes || 0)

  useEffect(() => {
    setIsLiked(localStorage_utils.isLiked(userId, pitch.id))
  }, [userId, pitch.id])

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
      })
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause()
    }
  }, [isActive])

  const handleLike = () => {
    localStorage_utils.toggleLike(userId, pitch.id)
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleShare = () => {
    const url = `${window.location.origin}/feed?video=${pitch.id}`
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
  }

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden snap-center">
      {/* Video */}
      {/* Video */}
      <video
        ref={videoRef}
        src={
          pitch.cloudflareId
            ? `https://videodelivery.net/${pitch.cloudflareId}/manifest/video.m3u8`
            : pitch.video
        }
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
        poster={
          pitch.cloudflareId
            ? `https://videodelivery.net/${pitch.cloudflareId}/thumbnails/thumbnail.jpg?time=1s`
            : undefined
        }
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Left side info */}
      <div className="absolute top-6 left-6 text-white z-10">
        <p className="text-sm font-semibold">{pitch.startup}</p>
        <p className="text-xs text-gray-300">{pitch.founder}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{pitch.stage}</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{pitch.place}</span>
        </div>
      </div>

      {/* Right side action bar */}
      <div className="absolute right-6 bottom-24 flex flex-col gap-6 z-10">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-2 text-white hover:scale-110 transition-transform"
          aria-label="Like"
        >
          <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          <span className="text-xs">{likeCount}</span>
        </button>

        <button
          onClick={() => onCommentClick(pitch)}
          className="flex flex-col items-center gap-2 text-white hover:scale-110 transition-transform"
          aria-label="Comment"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs">{pitch.comments || 0}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-2 text-white hover:scale-110 transition-transform"
          aria-label="Share"
        >
          <Share2 className="h-6 w-6" />
          <span className="text-xs">Share</span>
        </button>

        <button
          className="flex flex-col items-center gap-2 text-white hover:scale-110 transition-transform"
          aria-label="Save"
        >
          <Bookmark className="h-6 w-6" />
          <span className="text-xs">Save</span>
        </button>

        {user && (user.role === "investor" || user.role === "incubator") && (
          <button
            onClick={() => onScheduleMeetClick(pitch)}
            className="flex flex-col items-center gap-2 text-white hover:scale-110 transition-transform"
            aria-label="Schedule meet"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs">Meet</span>
          </button>
        )}

        {user && (user.role === "investor" || user.role === "incubator") && (
          <button
            onClick={() => onAIAnalysisClick(pitch)}
            className="flex flex-col items-center gap-2 text-white hover:scale-110 transition-transform"
            aria-label="AI Analysis"
          >
            <Sparkles className="h-6 w-6" />
            <span className="text-xs">AI</span>
          </button>
        )}
      </div>

      {/* Bottom description */}
      <div className="absolute bottom-6 left-6 right-20 text-white z-10">
        <p className="text-sm font-semibold">{pitch.title}</p>
        <p className="text-xs text-gray-200 mt-1">{pitch.description}</p>
      </div>
    </div>
  )
}
