import content from "@/content/pages/faq.json";
import { PageHero } from "@/components/PageHero";
import { ListBlock } from "@/components/ListBlock";
import { CTABand } from "@/components/CTABand";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  "FAQ — AGL Pallet",
  "Two-way vs four-way pallets, lead times, minimums, and second-source availability — answered for buyers working with a pallet brokerage.",
  "/faq/",
);

export default function Faq() {
  return (
    <main>
      <PageHero
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        body={content.hero.body}
      />

      <section className="scroll-mt-24 section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <ListBlock heading="Buyer questions" items={content.items} />
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
