import type { User, Pitch } from "./types"
import { samplePitches } from "./sample-data"

const KEYS = {
  USER: "evoa_user",
  VIDEOS: "evoa_videos",
  UPLOADS: "evoa_uploads",
  LIKES: "evoa_likes",
  COMMENTS: "evoa_comments",
  FILTERS: "evoa_filters",
  ANALYTICS: "evoa_analytics",
  AI_ANALYSES: "evoa_ai_analyses", // Added key for AI analysis caching
}

export const localStorage_utils = {
  // User
  getUser: (): User | null => {
    if (typeof window === "undefined") return null
    const user = window.localStorage.getItem(KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  setUser: (user: User) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(KEYS.USER, JSON.stringify(user))
  },

  clearUser: () => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(KEYS.USER)
  },

  // Videos
  getVideos: (): Pitch[] => {
    if (typeof window === "undefined") return samplePitches
    const videos = window.localStorage.getItem(KEYS.VIDEOS)
    return videos ? JSON.parse(videos) : samplePitches
  },

  setVideos: (videos: Pitch[]) => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(KEYS.VIDEOS, JSON.stringify(videos))
  },

  // Likes
  getLikes: (): Record<string, string[]> => {
    if (typeof window === "undefined") return {}
    const likes = window.localStorage.getItem(KEYS.LIKES)
    return likes ? JSON.parse(likes) : {}
  },

  toggleLike: (userId: string, videoId: string) => {
    if (typeof window === "undefined") return
    const likes = localStorage_utils.getLikes()
    if (!likes[userId]) likes[userId] = []
    const index = likes[userId].indexOf(videoId)
    if (index > -1) {
      likes[userId].splice(index, 1)
    } else {
      likes[userId].push(videoId)
    }
    window.localStorage.setItem(KEYS.LIKES, JSON.stringify(likes))
  },

  isLiked: (userId: string, videoId: string): boolean => {
    if (typeof window === "undefined") return false
    const likes = localStorage_utils.getLikes()
    return likes[userId]?.includes(videoId) || false
  },

  // Comments
  getComments: (): Record<string, any[]> => {
    if (typeof window === "undefined") return {}
    const comments = window.localStorage.getItem(KEYS.COMMENTS)
    return comments ? JSON.parse(comments) : {}
  },

  addComment: (videoId: string, userId: string, userName: string, text: string) => {
    if (typeof window === "undefined") return
    const comments = localStorage_utils.getComments()
    if (!comments[videoId]) comments[videoId] = []
    comments[videoId].push({
      id: Date.now().toString(),
      userId,
      userName,
      text,
      timestamp: Date.now(),
    })
    window.localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments))
  },

  getVideoComments: (videoId: string) => {
    if (typeof window === "undefined") return []
    const comments = localStorage_utils.getComments()
    return comments[videoId] || []
  },

  // AI Analysis
  getAIAnalyses: (): Record<string, any> => {
    if (typeof window === "undefined") return {}
    const analyses = window.localStorage.getItem(KEYS.AI_ANALYSES)
    return analyses ? JSON.parse(analyses) : {}
  },

  getAIAnalysis: (pitchId: string, userId: string) => {
    if (typeof window === "undefined") return null
    const analyses = localStorage_utils.getAIAnalyses()
    const key = `${pitchId}_${userId}`
    return analyses[key] || null
  },

  setAIAnalysis: (pitchId: string, userId: string, analysis: any) => {
    if (typeof window === "undefined") return
    const analyses = localStorage_utils.getAIAnalyses()
    const key = `${pitchId}_${userId}`
    analyses[key] = analysis
    window.localStorage.setItem(KEYS.AI_ANALYSES, JSON.stringify(analyses))
  },

  // Clear all
  clearAll: () => {
    if (typeof window === "undefined") return
    Object.values(KEYS).forEach((key) => {
      window.localStorage.removeItem(key)
    })
  },
}
