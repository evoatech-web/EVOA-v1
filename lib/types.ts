export type UserRole = "startup" | "investor" | "incubator" | "viewer"

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  meta: Record<string, any>
}

export interface Pitch {
  id: string
  title: string
  startup: string
  founder: string
  stage: "Idea" | "MVP" | "Early Revenue" | "Growth" | "Scaling"
  category: string
  place: string
  video: string
  cloudflareId?: string
  videoStatus?: "uploading" | "ready" | "failed"
  duration?: number
  image?: string
  description: string
  likes?: number
  comments?: number
}

export interface Comment {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: number
}

export interface AIAnalysis {
  pitchId: string
  userId: string
  timestamp: number
  brief: {
    problem: string
    solution: string
    targetCustomer: string
    currentStage: string
    ask: string
  }
  readinessSignals: {
    clarity: "High" | "Medium" | "Low"
    traction: "Strong" | "Early" | "None"
    market: "Large" | "Niche" | "Unclear"
    founderSignal: "Convincing" | "Average" | "Needs Depth"
  }
  questionsToAsk: string[]
  risksAndGaps: string[]
  comparableContext: {
    similarStartups: string
    differentiation: string
  }
  recommendation: {
    verdict: "Worth a short intro call" | "Track for later" | "Skip for now"
    reasoning: string
  }
}

export interface Analytics {
  startupId: string
  views: number
  likes: number
  comments: number
  shares: number
  traction: {
    users: number
    revenue: string
    growth: number
  }
  metrics: {
    tam: string
    sam: string
    som: string
    runway: string
    monthlyBurn: string
    arr: string
    cac: string
    ltv: string
  }
}
