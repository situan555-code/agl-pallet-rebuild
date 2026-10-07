// Root-relative site paths ("/assets/x.jpg") resolve against the deployed
// lab site, so photos and logos render inside claude.ai/design.
export const ASSET_ORIGIN = "https://nx7k-lab-m4.vercel.app";

export function assetUrl(src: string): string {
  return src.startsWith("/") && !src.startsWith("//") ? ASSET_ORIGIN + src : src;
}
