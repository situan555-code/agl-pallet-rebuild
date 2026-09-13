/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    // Skip AVIF — cold encode on first hit tanks LCP on mobile audits.
    formats: ["image/webp"],
  },
};

export default nextConfig;
