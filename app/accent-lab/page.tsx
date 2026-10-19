import type { Metadata } from "next";
import lab from "@/content/brand/accent-lab.json";
import { AccentLabLoader } from "@/components/accent-lab/AccentLabLoader";

// Internal brand tool. Always noindex (not host-conditional), and deliberately
// absent from the nav, sitemap.ts, the search index and scripts/lib/spec-manifest.js.
export const metadata: Metadata = {
  title: lab.copy.title,
  description: lab.copy.description,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function AccentLabPage() {
  return <AccentLabLoader />;
}
