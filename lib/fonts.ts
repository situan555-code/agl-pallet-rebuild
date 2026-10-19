import { Inter, Exo_2 } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  // optional: if the face misses the first paint, do not swap later.
  // A late swap was the simulated mobile LCP (body copy and headings).
  display: "optional",
  preload: true,
});

export const exo2 = Exo_2({
  subsets: ["latin"],
  weight: "900",
  style: "italic",
  variable: "--font-exo2",
  // swap, not optional: optional drops the face whenever it misses the first
  // ~100ms, so cold visits showed the generic fallback instead of the brand
  // face. One small file (900 italic, latin), preloaded to keep the swap short.
  display: "swap",
  preload: true,
});
