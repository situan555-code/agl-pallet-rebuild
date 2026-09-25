import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isVercelAppHost } from "@/lib/host";

// SPEC_V1.md §1 redirects. With skipTrailingSlashRedirect, this middleware owns
// both the three 301s and the sitewide trailing-slash normalization (308).
const PERMANENT: Record<string, string> = {
  "/about": "/who-we-are/",
  "/about/": "/who-we-are/",
  "/logistics-process": "/how-we-work/",
  "/logistics-process/": "/how-we-work/",
  "/industries-served": "/industries/",
  "/industries-served/": "/industries/",
};

function withHostRobots(response: NextResponse, request: NextRequest) {
  // Host header at request time. Do not key this off VERCEL_ENV or a build flag:
  // the production alias and every preview alias share this deployment, and
  // aglpallet.com will too once DNS moves. Only *.vercel.app is noindex.
  if (isVercelAppHost(request.headers.get("host"))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const permanent = PERMANENT[pathname];
  if (permanent) {
    // Build from request.url so the Location keeps the trailing slash Next
    // would otherwise strip under trailingSlash + skipTrailingSlashRedirect.
    return withHostRobots(NextResponse.redirect(new URL(permanent, request.url), 301), request);
  }

  if (
    pathname.length > 1 &&
    !pathname.endsWith("/") &&
    !pathname.includes(".")
  ) {
    return withHostRobots(NextResponse.redirect(new URL(`${pathname}/`, request.url), 308), request);
  }

  return withHostRobots(NextResponse.next(), request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|assets/|favicon.ico|icon-|apple-touch-icon|site.webmanifest).*)",
  ],
};
