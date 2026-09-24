// IndexNow ping, inert until Nautis provisions a real key (DECISIONS.md
// Wave 0). No key file ships in public/; when INDEXNOW_KEY is set, host the
// matching /<key>.txt before calling this.
const ENDPOINT = "https://api.indexnow.org/indexnow";
const HOST = "aglpallet.com";

export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY;
  if (!key || urls.length === 0) return false;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: urls }),
  });
  return res.ok;
}
