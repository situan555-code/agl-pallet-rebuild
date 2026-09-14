/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    // AVIF tried and reverted 2026-09-14 — measured worse LCP than WebP under
    // this sandbox's simulated mobile CPU throttling (decode cost), even with
    // the harness's image-cache warm-up in place. See DECISIONS.md.
    formats: ["image/webp"],
  },
};

export default nextConfig;
