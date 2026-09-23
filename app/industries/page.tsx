import content from "@/content/pages/industries.json";
import { Hero3 } from "@/components/hero3";
import { Feature3 } from "@/components/feature3";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Industries We Serve — AGL Pallet',
  'Building materials, chemicals, refractories, 3PL and distribution, metal fabrication, energy, plastics, and food and beverage.',
  '/industries/',
);

export default function Industries() {
  return (
    <main>
      <Hero3 eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      <Feature3
        variant="ruled"
        columns={2}
        features={content.industries.map((item) => ({ title: item.heading, description: item.body }))}
      />

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
