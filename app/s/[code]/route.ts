import { type NextRequest, NextResponse } from "next/server"
import { getOriginalUrl } from "@/lib/actions"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  const shortCode = params.code

  // Get the original URL
  const result = await getOriginalUrl(shortCode)

  if (result.error) {
    // Return a 404 page for invalid short URLs
    return new NextResponse("Short URL not found", { status: 404 })
  }

  // Redirect to the original URL
  return NextResponse.redirect(result.originalUrl)
}
