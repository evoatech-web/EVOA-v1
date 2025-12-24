import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
    try {
        const { duration } = await request.json()

        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
        const apiToken = process.env.CLOUDFLARE_API_TOKEN

        if (!accountId || !apiToken) {
            return NextResponse.json({ error: "Missing Cloudflare credentials" }, { status: 500 })
        }

        // Call Cloudflare Stream API to create a direct upload URL
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                maxDurationSeconds: 120, // Enforce max duration (slightly higher than 90s to contain buffer)
                expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // URL expires in 30 mins
                requireSignedURLs: false,
                allowedOrigins: ["*"], // Restrict this in production
            }),
        })

        const data = await response.json()

        if (!data.success) {
            throw new Error(data.errors?.[0]?.message || "Failed to create upload URL")
        }

        return NextResponse.json({
            uploadUrl: data.result.uploadURL,
            videoId: data.result.uid,
        })
    } catch (error) {
        console.error("Upload initialization error:", error)
        return NextResponse.json({ error: "Failed to initialize upload" }, { status: 500 })
    }
}
