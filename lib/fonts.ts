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
  display: "optional",
  // Home LCP is the poster image. About/quote LCP is Inter text.
  // Preloading the display face on every page contended with that first paint.
  preload: false,
});
