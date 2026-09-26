/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Hand trailing-slash + §1 301s in proxy.ts so /about returns 301, not 308→/about/.
  skipTrailingSlashRedirect: true,
  skipProxyUrlNormalize: true,
  images: {
    // AVIF tried and reverted 2026-09-14 — measured worse LCP than WebP under
    // this sandbox's simulated mobile CPU throttling (decode cost), even with
    // the harness's image-cache warm-up in place. See DECISIONS.md.
    formats: ["image/webp"],
    // Next defaults to [75] and snaps every other quality to it. These are
    // the values already set on next/image, including the hero poster at 60.
    qualities: [60, 70, 72, 75, 78],
  },
  // SPEC §1 301s live in proxy.ts, not here. next.config redirects run
  // before the proxy, so a config redirect would skip the host-conditional
  // X-Robots-Tag. The proxy checks the permanent map before trailing-slash
  // 308s, and returns statusCode 301 (not 308).
};

export default nextConfig;
