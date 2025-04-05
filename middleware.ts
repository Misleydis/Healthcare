import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Paths that require authentication
const protectedPaths = ["/dashboard", "/assessment", "/telemedicine", "/monitoring", "/treatment"]

// Paths that are accessible only when not authenticated
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const path = request.nextUrl.pathname

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  // Check if the path is an auth path
  const isAuthPath = authPaths.some((authPath) => path === authPath || path.startsWith(`${authPath}/`))

  // Verify token
  const isAuthenticated = token ? (await verifyToken(token)) !== null : false

  // Redirect logic
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to login if trying to access protected path without authentication
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  if (isAuthPath && isAuthenticated) {
    // Redirect to dashboard if trying to access auth path while authenticated
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}

