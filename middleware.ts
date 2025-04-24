import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define paths
const publicPaths = ["/", "/login", "/forgot-password"];
const protectedPaths = ["/dashboard", "/settings"];
const adminOnlyPaths = [
  "/dashboard/products",
  "/dashboard/customers",
  "/dashboard/orders",
  "/dashboard/users",
  "/dashboard/roles",
];

// Ensure JWT secret is set
const JWT_SECRET = process.env.SECRET_JWT;
if (!JWT_SECRET) {
  throw new Error("SECRET_JWT environment variable is not set");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log only in development for debugging (optional)
  if (process.env.NODE_ENV === "development") {
    console.log("Middleware running for:", pathname);
    console.log("Token:", request.cookies.get("token")?.value);
  }

  // Allow public paths without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("jwt")?.value;
  if (!token) {
    // Redirect to login for protected paths
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Allow non-protected paths to proceed (e.g., static assets)
    return NextResponse.next();
  }

  try {
    // Verify JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log("JWT payload:", payload);
    // Validate payload structure
    if (!payload.sub || !payload.role) {
      throw new Error("Invalid JWT payload: missing sub or role");
    }

    // Check for admin-only paths
    if (adminOnlyPaths.some((path) => pathname.startsWith(path))) {
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Attach user info to headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.sub));
    requestHeaders.set("x-user-role", String(payload.role));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Middleware error:", error);
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

// Statically define matcher
export const config = {
  matcher: [
    "/",
    "/login",
    "/forgot-password",
    "/dashboard",
    "/settings",
    "/dashboard/products",
    "/dashboard/customers",
    "/dashboard/orders",
    "/dashboard/users",
    "/dashboard/roles",
    "/dashboard/:path*",
    "/settings/:path*",
  ],
};
