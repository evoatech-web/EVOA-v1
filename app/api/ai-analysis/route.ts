import { GoogleGenerativeAI } from "@google/generative-ai"
import type { Pitch } from "@/lib/types"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { pitch, userId, customQuestion }: { pitch: Pitch; userId: string; customQuestion?: string } =
      await request.json()

    if (!pitch || !userId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    if (customQuestion) {
      const customPrompt = `You are an analytical AI assistant helping investors evaluate startup pitches. Be neutral, analytical, and slightly skeptical. Never use emojis or hype words like "revolutionary" or "huge potential".

Analyze this startup pitch:

Startup: ${pitch.startup}
Founder: ${pitch.founder}
Category: ${pitch.category}
Stage: ${pitch.stage}
Location: ${pitch.place}
Description: ${pitch.description}
Title: ${pitch.title}

Answer this specific question from the investor: "${customQuestion}"

Provide a direct, concise answer (2-4 sentences). Be analytical and fact-based. If you need to speculate, say so explicitly.`

      const result = await model.generateContent(customPrompt)
      const response = result.response
      const answer = response.text().trim()

      return Response.json({ answer })
    }

    const prompt = `You are an analytical AI assistant helping investors evaluate startup pitches. Be neutral, analytical, and slightly skeptical. Never use emojis or hype words like "revolutionary" or "huge potential". No numeric scores or ratings.

Analyze this startup pitch:

Startup: ${pitch.startup}
Founder: ${pitch.founder}
Category: ${pitch.category}
Stage: ${pitch.stage}
Location: ${pitch.place}
Description: ${pitch.description}
Title: ${pitch.title}

Provide a structured analysis in the following JSON format:

{
  "brief": {
    "problem": "One-line problem statement",
    "solution": "One-line solution statement",
    "targetCustomer": "Who is the target customer",
    "currentStage": "Current stage of the startup",
    "ask": "What they are asking for (funding, incubation, mentorship)"
  },
  "readinessSignals": {
    "clarity": "High, Medium, or Low",
    "traction": "Strong, Early, or None",
    "market": "Large, Niche, or Unclear",
    "founderSignal": "Convincing, Average, or Needs Depth"
  },
  "questionsToAsk": [
    "3-5 sharp, stage-aware investor questions"
  ],
  "risksAndGaps": [
    "Short, neutral bullet points about risks"
  ],
  "comparableContext": {
    "similarStartups": "Similar startups or patterns in this space",
    "differentiation": "Whether differentiation is clear or weak"
  },
  "recommendation": {
    "verdict": "Worth a short intro call, Track for later, or Skip for now",
    "reasoning": "One-line reasoning for the verdict"
  }
}

Return ONLY valid JSON, no markdown, no explanations.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse the JSON response
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()
    const analysis = JSON.parse(cleanedText)

    // Add metadata
    analysis.pitchId = pitch.id
    analysis.userId = userId
    analysis.timestamp = Date.now()

    return Response.json(analysis)
  } catch (error) {
    console.error("AI Analysis Error:", error)
    return Response.json({ error: "Failed to generate analysis" }, { status: 500 })
  }
}
