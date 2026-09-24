import type { MetadataRoute } from "next";
import site from "@/content/site.json";

// Search and AI crawlers named explicitly so a later blanket rule cannot
// silently shut them out. No llms.txt (Resource Library blueprint).
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
    sitemap: `${site.organization.url}/sitemap.xml`,
  };
}
