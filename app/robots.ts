import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

// Search and AI crawlers named explicitly so a later blanket rule cannot
// silently shut them out. No llms.txt (Resource Library blueprint).
// Stays permissive on *.vercel.app — do not Disallow: /. The noindex gate is
// the host-conditional header and meta tag (middleware.ts, app/layout.tsx).
const ALLOWED_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Applebot",
  "Google-Extended",
  "GPTBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: ALLOWED_BOTS, allow: "/" },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
