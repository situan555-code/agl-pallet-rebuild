import content from "@/content/pages/custom-engineered.json";
import { PageHero } from "@/components/PageHero";
import { ListBlock } from "@/components/ListBlock";
import { CTABand } from "@/components/CTABand";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Custom and Engineered Pallets, Crates and Skids — AGL Pallet',
  'Odd-size, oversize, and heavy-duty pallet solutions. We spec to the load, then source the shop set up to build it.',
  '/custom-engineered/',
);

export default function CustomEngineered() {
  return (
    <main>
      <PageHero
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        body={content.hero.body}
      />

      <section className="section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <ListBlock heading={content.whereCustomPays.heading} items={content.whereCustomPays.items} />
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
