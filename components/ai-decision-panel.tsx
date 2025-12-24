"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Pitch, AIAnalysis, User } from "@/lib/types"
import { X, Loader2, Sparkles } from "lucide-react"
import { localStorage_utils } from "@/lib/localStorage"

interface AIDecisionPanelProps {
  pitch: Pitch | null
  user: User
  isOpen: boolean
  onClose: () => void
}

export function AIDecisionPanel({ pitch, user, isOpen, onClose }: AIDecisionPanelProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customQuestion, setCustomQuestion] = useState<string>("")
  const [customAnswer, setCustomAnswer] = useState<string | null>(null)
  const [isCustomLoading, setIsCustomLoading] = useState(false)

  useEffect(() => {
    if (!pitch || !isOpen) {
      setAnalysis(null)
      setError(null)
      setCustomQuestion("")
      setCustomAnswer(null)
      return
    }

    // Check cache first
    const cached = localStorage_utils.getAIAnalysis(pitch.id, user.id)
    if (cached) {
      setAnalysis(cached)
      return
    }

    // Fetch new analysis
    const fetchAnalysis = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/ai-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pitch, userId: user.id }),
        })

        if (!response.ok) throw new Error("Failed to analyze pitch")

        const data = await response.json()
        setAnalysis(data)
        localStorage_utils.setAIAnalysis(pitch.id, user.id, data)
      } catch (err) {
        setError("Unable to generate analysis. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [pitch, user.id, isOpen])

  const handleQuickQuestion = async (question: string) => {
    if (!pitch) return

    setIsCustomLoading(true)
    setCustomAnswer(null)
    setCustomQuestion(question)

    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, userId: user.id, customQuestion: question }),
      })

      if (!response.ok) throw new Error("Failed to get answer")

      const data = await response.json()
      setCustomAnswer(data.answer)
    } catch (err) {
      setCustomAnswer("Unable to answer this question. Please try again.")
      console.error(err)
    } finally {
      setIsCustomLoading(false)
    }
  }

  if (!isOpen || !pitch) return null

  return (
    <>
      {/* Desktop: Right side panel */}
      <div className="hidden md:block">
        <div
          className={`fixed top-0 right-0 h-full w-[440px] bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <PanelContent
            pitch={pitch}
            analysis={analysis}
            isLoading={isLoading}
            error={error}
            onClose={onClose}
            onQuickQuestion={handleQuickQuestion}
            customQuestion={customQuestion}
            customAnswer={customAnswer}
            isCustomLoading={isCustomLoading}
          />
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      <div className="md:hidden">
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 z-50 max-h-[85vh] ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <PanelContent
            pitch={pitch}
            analysis={analysis}
            isLoading={isLoading}
            error={error}
            onClose={onClose}
            onQuickQuestion={handleQuickQuestion}
            customQuestion={customQuestion}
            customAnswer={customAnswer}
            isCustomLoading={isCustomLoading}
          />
        </div>
      </div>
    </>
  )
}

function PanelContent({
  pitch,
  analysis,
  isLoading,
  error,
  onClose,
  onQuickQuestion,
  customQuestion,
  customAnswer,
  isCustomLoading,
}: {
  pitch: Pitch
  analysis: AIAnalysis | null
  isLoading: boolean
  error: string | null
  onClose: () => void
  onQuickQuestion: (question: string) => void
  customQuestion: string
  customAnswer: string | null
  isCustomLoading: boolean
}) {
  const quickQuestions = [
    "Who are the true competitors?",
    "Compare with top 3 competitors",
    "What's the market size opportunity?",
    "Is the team qualified?",
    "What are the red flags?",
    "Why might this fail?",
    "What's missing from the pitch?",
    "Is this defensible?",
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-lg">AI Decision Assistant</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Startup header */}
        <div className="pb-4 border-b">
          <h3 className="font-bold text-xl">{pitch.startup}</h3>
          <p className="text-sm text-gray-600 mt-1">{pitch.founder}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{pitch.category}</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{pitch.stage}</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3">Quick Questions</h4>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onQuickQuestion(question)}
                disabled={isCustomLoading}
                className="text-xs px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-full transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {customQuestion && (
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
            <h4 className="font-bold text-sm text-purple-900 mb-2">Question: {customQuestion}</h4>
            {isCustomLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : customAnswer ? (
              <p className="text-sm text-gray-800">{customAnswer}</p>
            ) : null}
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        {analysis && !isLoading && (
          <>
            {/* 30-Second Brief */}
            <Section title="30-Second Startup Brief">
              <InfoRow label="Problem" value={analysis.brief.problem} />
              <InfoRow label="Solution" value={analysis.brief.solution} />
              <InfoRow label="Target Customer" value={analysis.brief.targetCustomer} />
              <InfoRow label="Current Stage" value={analysis.brief.currentStage} />
              <InfoRow label="Ask" value={analysis.brief.ask} />
            </Section>

            {/* Investment Readiness Signals */}
            <Section title="Investment Readiness Signals">
              <SignalRow label="Clarity" value={analysis.readinessSignals.clarity} />
              <SignalRow label="Traction" value={analysis.readinessSignals.traction} />
              <SignalRow label="Market" value={analysis.readinessSignals.market} />
              <SignalRow label="Founder Signal" value={analysis.readinessSignals.founderSignal} />
            </Section>

            {/* Top Questions */}
            <Section title="Top Questions to Ask This Startup">
              <ul className="space-y-2">
                {analysis.questionsToAsk.map((q, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Key Risks */}
            <Section title="Key Risks / Gaps to Validate">
              <ul className="space-y-2">
                {analysis.risksAndGaps.map((risk, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0"
                  >
                    {risk}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Comparable Context */}
            <Section title="Comparable & Market Context">
              <InfoRow label="Similar Startups" value={analysis.comparableContext.similarStartups} />
              <InfoRow label="Differentiation" value={analysis.comparableContext.differentiation} />
            </Section>

            {/* AI Recommendation */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
              <h4 className="font-bold text-sm text-blue-900 mb-2">AI Recommendation</h4>
              <p className="font-semibold text-gray-900">{analysis.recommendation.verdict}</p>
              <p className="text-sm text-gray-700 mt-2">{analysis.recommendation.reasoning}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-bold text-sm text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-800 ml-2">{value}</span>
    </div>
  )
}

function SignalRow({ label, value }: { label: string; value: string }) {
  const colorMap: Record<string, string> = {
    High: "text-green-700 bg-green-100",
    Medium: "text-yellow-700 bg-yellow-100",
    Low: "text-red-700 bg-red-100",
    Strong: "text-green-700 bg-green-100",
    Early: "text-yellow-700 bg-yellow-100",
    None: "text-red-700 bg-red-100",
    Large: "text-green-700 bg-green-100",
    Niche: "text-yellow-700 bg-yellow-100",
    Unclear: "text-red-700 bg-red-100",
    Convincing: "text-green-700 bg-green-100",
    Average: "text-yellow-700 bg-yellow-100",
    "Needs Depth": "text-red-700 bg-red-100",
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[value] || "text-gray-700 bg-gray-100"}`}>
        {value}
      </span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )
}
