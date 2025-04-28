import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Public routes accessible without authentication
const publicPaths = [
  "/",
  "/login", // New route for unauthenticated users to log in
  "/forgot-password",
];

// Admin-only routes (including /login)
const adminPaths = ["/admin", "/dashboard", "/login"];

// Ensure JWT secret is set
const JWT_SECRET = process.env.SECRET_JWT;
if (!JWT_SECRET) throw new Error("SECRET_JWT environment variable is not set");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Helper to check if a path matches a pattern (including dynamic routes)
  const isPathMatch = (path: string) =>
    pathname === path ||
    (path.includes("[id]") &&
      pathname.match(new RegExp(`^${path.replace("[id]", "[^/]+")}$`)));

  // 1) Allow public paths
  if (publicPaths.some(isPathMatch)) {
    return NextResponse.next();
  }

  // 2) Check for token
  const token = request.cookies.get("jwt")?.value;
  if (!token) {
    // Redirect to /signin instead of /login for unauthenticated users
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    // 3) Verify JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 4) Handle role-based access
    const isAdminPath = adminPaths.some(isPathMatch);
    if (isAdminPath && payload.role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 5) Allow ROLE_CUSTOMER or ROLE_ADMIN for non-admin protected routes
    if (!["ROLE_CUSTOMER", "ROLE_ADMIN"].includes(payload.role as string)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // 6) Attach user headers and proceed
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(payload.sub));
    requestHeaders.set("x-user-role", String(payload.role));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (err: Error | unknown) {
    console.error(
      "JWT verification error:",
      err instanceof Error ? err.message : err
    );
    // Invalid or expired token → clear cookie + redirect
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.delete("jwt");
    return response;
  }
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals, API routes, public files, and globals.css
    "/((?!_next/static|_next/image|favicon.ico|api|static|public|globals.css).*)",
  ],
};
