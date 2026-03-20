import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_EXACT = new Set([
  "/",
  "/zh",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/pricing",
  "/privacy",
  "/terms",
  "/data-deletion",
  "/book-demo",
  "/product",
  "/company",
]);

const PUBLIC_PREFIX = [
  "/blog",
  "/research",
  "/zh/",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap",
  "/api/",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public exact paths
  if (PUBLIC_EXACT.has(pathname)) return NextResponse.next();

  // Allow public prefixes
  if (PUBLIC_PREFIX.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Allow static files
  if (/\.(ico|png|svg|jpg|jpeg|gif|webp|css|js|woff|woff2|txt|xml)$/.test(pathname)) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = request.cookies.get("avanti_auth");
  if (!authCookie?.value) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
