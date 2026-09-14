import blurMap from "./blur-placeholders.json";

const map = blurMap as Record<string, string>;

export function getBlurDataURL(src: string): string | undefined {
  return map[src];
}
