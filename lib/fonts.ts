import { Inter, Anton } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  // optional: if the face misses the first paint, do not swap later.
  // A late swap was the simulated mobile LCP (body copy and headings).
  display: "optional",
  preload: true,
});

export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "optional",
  preload: true,
});
