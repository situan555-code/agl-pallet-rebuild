import content from "@/content/pages/industries.json";
import { PageHero } from "@/components/PageHero";
import { TrioGrid } from "@/components/TrioGrid";
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

      <section className="section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <TrioGrid cards={content.industries} />
        </div>
      </section>

      <CTABand
        heading={content.ctaBand.heading}
        body={content.ctaBand.body}
        cta={content.ctaBand.cta}
      />
    </main>
  );
}
