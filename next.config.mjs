/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Hand trailing-slash + §1 301s in middleware so /about returns 301, not 308→/about/.
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  images: {
    // AVIF tried and reverted 2026-09-14 — measured worse LCP than WebP under
    // this sandbox's simulated mobile CPU throttling (decode cost), even with
    // the harness's image-cache warm-up in place. See DECISIONS.md.
    formats: ["image/webp"],
  },
  async redirects() {
    // statusCode: 301 (not permanent:true → 308) so routes.js §1 check passes.
    // Both slash and slashless sources — trailingSlash normalization must not
    // win before these fire.
    return [
      { source: "/about", destination: "/who-we-are/", statusCode: 301 },
      { source: "/about/", destination: "/who-we-are/", statusCode: 301 },
      { source: "/logistics-process", destination: "/how-we-work/", statusCode: 301 },
      { source: "/logistics-process/", destination: "/how-we-work/", statusCode: 301 },
      { source: "/industries-served", destination: "/industries/", statusCode: 301 },
      { source: "/industries-served/", destination: "/industries/", statusCode: 301 },
    ];
  },
};

export default nextConfig;
