// IndexNow ping, inert until Nautis provisions a real key (DECISIONS.md
// Wave 0). No key file ships in public/; when INDEXNOW_KEY is set, host the
// matching /<key>.txt before calling this. Host comes from SITE_URL
// (default https://aglpallet.com) — do not ping a *.vercel.app origin.
import { getSiteUrl } from "@/lib/site-url";

const ENDPOINT = "https://api.indexnow.org/indexnow";

export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || urls.length === 0) return false;
  const siteUrl = getSiteUrl();
  const host = new URL(siteUrl).host;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${siteUrl}/${key}.txt`,
      urlList: urls,
    }),
  });
  return res.ok;
}
