import content from "@/content/pages/industries.json";
import { PageHero } from "@/components/PageHero";
import { RuleList } from "@/components/RuleList";
import { CTABand } from "@/components/CTABand";
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
      <PageHero
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        body={content.hero.body}
      />

      <section className="section-y">
        <RuleList
          layout="industries"
          items={content.industries.map((item) => ({
            title: item.heading,
            body: item.body,
          }))}
        />
      </section>

      <CTABand
        heading={content.ctaBand.heading}
        body={content.ctaBand.body}
        cta={content.ctaBand.cta}
      />
    </main>
  );
}
