import content from "@/content/pages/partners.json";
import { PageHero } from "@/components/PageHero";
import { TrioGrid } from "@/components/TrioGrid";
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
      <PageHero
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        body={content.hero.body}
      />

      <section className="section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <TrioGrid cards={content.cards} />
        </div>
      </section>
    </main>
  );
}
