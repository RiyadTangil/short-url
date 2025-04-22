import { type NextRequest, NextResponse } from "next/server"
import { shortenUrl } from "@/lib/actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Get the host from the request
    const host = request.headers.get("host") || "localhost:3000"
    const protocol = host.includes("localhost") ? "http" : "https"
    const fullHost = `${protocol}://${host}`

    const result = await shortenUrl(url, fullHost)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
