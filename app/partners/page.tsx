import content from "@/content/pages/partners.json";
import { Hero3 } from "@/components/hero3";
import { Feature3 } from "@/components/feature3";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Partners — AGL Pallet',
  'AGL works with family-run mills and regional carriers across the Midwest and Mid-Atlantic. Two ways to work with us.',
  '/partners/',
);

export default function Partners() {
  return (
    <main>
      <Hero3 eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      <Feature3
        variant="card"
        columns={2}
        features={content.cards.map((c) => ({ title: c.heading, description: c.body, href: c.href }))}
      />
    </main>
  );
}
