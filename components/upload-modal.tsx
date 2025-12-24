"use client"

import type React from "react"

import { useState } from "react"
import type { User, Pitch } from "@/lib/types"
import { localStorage_utils } from "@/lib/localStorage"
import { X, Upload } from "lucide-react"

interface UploadModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

export function UploadModal({ user, isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stage: "MVP",
    category: "Fintech",
    place: "",
  })

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 60MB for MVP)
      if (file.size > 60 * 1024 * 1024) {
        alert("Video must be less than 60MB")
        return
      }

      setVideoFile(file)
      const preview = URL.createObjectURL(file)
      setVideoPreview(preview)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (user.role === "startup" && !videoFile) {
      alert("Video is required for startup pitches")
      return
    }

    setIsSubmitting(true)

    try {
      let cloudflareId = ""
      let videoStatus: "uploading" | "ready" | "failed" = "ready" // Simplification for demo (real world would be 'uploading')

      if (videoFile) {
        // 1. Get Direct Upload URL
        const response = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ duration: 60 }),
        })

        if (!response.ok) {
          throw new Error("Failed to get upload URL")
        }

        const data = await response.json()
        const uploadUrl = data.uploadUrl
        cloudflareId = data.videoId

        // 2. Upload to Cloudflare
        const formData = new FormData()
        formData.append("file", videoFile)

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload video to Cloudflare")
        }

        // Wait briefly to ensure Cloudflare registers it (optional, mainly for UX smoothness in demo)
        videoStatus = "ready"
      }

      // Create new pitch object
      const newPitch: Pitch = {
        id: `upload-${Date.now()}`,
        title: formData.title,
        startup: user.role === "startup" ? user.meta.startupName : "User Post",
        founder: user.name,
        stage: formData.stage as any, // Cast to match type
        category: formData.category,
        place: formData.place,
        video: videoFile ? "" : (videoPreview || "/videos/pitch1.mp4"), // Legacy video field empty if using CF
        cloudflareId: cloudflareId,
        videoStatus: videoStatus,
        description: formData.description,
        likes: 0,
        comments: 0,
      }

      // Add to videos
      const videos = localStorage_utils.getVideos()
      videos.unshift(newPitch)
      localStorage_utils.setVideos(videos)

      // Reset form
      setFormData({
        title: "",
        description: "",
        stage: "MVP",
        category: "Fintech",
        place: "",
      })
      setVideoFile(null)
      setVideoPreview("")

      alert("Upload successful!")
      onUploadSuccess()
      onClose()
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !user) return null

  const isStartup = user.role === "startup"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-background rounded-t-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-lg">{isStartup ? "Upload Your Pitch" : "Create Post"}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Video upload */}
          {isStartup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Video <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" id="video-input" />
                <label htmlFor="video-input" className="cursor-pointer block">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-foreground font-medium">Click to upload video</p>
                  <p className="text-xs text-muted-foreground mt-1">Max 60 seconds, 60MB</p>
                </label>
              </div>
              {videoPreview && (
                <div className="mt-4">
                  <video src={videoPreview} controls className="w-full rounded-lg max-h-48" />
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Pitch title or post headline"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your pitch or post"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              required
            />
          </div>

          {/* Stage */}
          {isStartup && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Idea</option>
                <option>MVP</option>
                <option>Early Revenue</option>
                <option>Growth</option>
                <option>Scaling</option>
              </select>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Fintech</option>
              <option>HRTech</option>
              <option>ClimateTech</option>
              <option>HealthTech</option>
              <option>EdTech</option>
              <option>Other</option>
            </select>
          </div>

          {/* Place */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Location</label>
            <input
              type="text"
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
              placeholder="City or region"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-border p-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground font-semibold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (isStartup && !videoFile)}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}
