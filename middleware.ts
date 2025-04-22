import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // You can add rate limiting, analytics, or other middleware functionality here
  return NextResponse.next()
}

export const config = {
  matcher: ["/s/:path*", "/api/:path*"],
}
