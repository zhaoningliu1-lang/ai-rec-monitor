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
  "/audit",       // free public audit — core cold-email landing page
  "/zh/audit",
  "/methodology", // public trust page — linked from every report
]);

const PUBLIC_PREFIX = [
  "/blog",
  "/research",
  "/r/",
  "/zh/",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap",
  "/api/",
  "/a2a-demo",
  "/opportunity-engine",
  "/hackathon",
  "/audit",       // covers /audit and any sub-paths
  "/runs/",       // individual reports are share-by-link (UUID = unguessable);
                  // the run page already has its own guest-blur for competitors.
                  // Without this, the anonymous audit's "View full report" CTA
                  // bounced straight into /login — funnel dead end.
  "/methodology", // covers /methodology (zh is under /zh/ prefix already)
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
