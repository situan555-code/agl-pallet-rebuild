import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const permanent = PERMANENT[pathname];
  if (permanent) {
    // Build from request.url so the Location keeps the trailing slash Next
    // would otherwise strip under trailingSlash + skipTrailingSlashRedirect.
    return NextResponse.redirect(new URL(permanent, request.url), 301);
  }

  if (
    pathname.length > 1 &&
    !pathname.endsWith("/") &&
    !pathname.includes(".")
  ) {
    return NextResponse.redirect(new URL(`${pathname}/`, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|assets/|favicon.ico|icon-|apple-touch-icon|site.webmanifest).*)",
  ],
};
