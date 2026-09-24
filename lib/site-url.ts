import { hostnameFromHostHeader } from "@/lib/host";

/**
 * Single production origin for sitemap URLs, metadataBase (canonical + og:url),
 * JSON-LD absolute URLs, robots.txt Sitemap line, and IndexNow.
 *
 * Set SITE_URL in the Vercel project if you need to override the default.
 * A *.vercel.app value is ignored so canonicals cannot drift onto the demo host.
 * The domain switch does not change SITE_URL — it stays https://aglpallet.com.
 */
export const DEFAULT_SITE_URL = "https://aglpallet.com";

export function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim();
  const candidate = originOf(fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_SITE_URL);
  if (!candidate) return DEFAULT_SITE_URL;
  const hostname = hostnameFromHostHeader(new URL(candidate).host);
  if (hostname.endsWith(".vercel.app")) return DEFAULT_SITE_URL;
  return candidate;
}

function originOf(value: string): string | null {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}
