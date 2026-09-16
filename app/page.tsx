import home from "@/content/pages/home.json";
import { Hero } from "@/components/Hero";
import { TrioGrid } from "@/components/TrioGrid";
import { CapabilityTrio } from "@/components/CapabilityTrio";
import { ProseBlock } from "@/components/ProseBlock";
import { CTABand } from "@/components/CTABand";
import { TbdImage } from "@/components/TbdImage";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'AGL Pallet — Pallet Sourcing and Managed Freight for Manufacturers',
  'AGL Pallet sources new, custom, and engineered pallets from family-run mills across the Midwest and Mid-Atlantic, and manages the freight on every order.',
  '/',
);

export default function Home() {
  return (
    <main>
      <Hero
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        body={home.hero.body}
        image={home.hero.image}
        buttons={home.hero.buttons as { label: string; href: string; variant: "pill-light" | "ghost-light" }[]}
      />

      <section className="px-6">
        <div className="mx-auto max-w-[1440px]">
          <CapabilityTrio items={home.capability.cards} />
        </div>
      </section>

      <section className="section-y section-hairline px-6">
        <div className="mx-auto max-w-[1440px]">
          <ProseBlock
            eyebrow={home.whatWeDo.eyebrow}
            heading={home.whatWeDo.heading}
            paragraphs={home.whatWeDo.paragraphs}
          />
        </div>
      </section>

      <section className="section-y section-hairline px-6">
        <div className="mx-auto max-w-[1440px]">
          <TrioGrid cards={home.differentiators.cards} variant="proof" />
        </div>
      </section>

      <section className="section-y section-hairline px-6">
        <div className="mx-auto max-w-[1440px]">
          <ProseBlock
            eyebrow={home.pledge.eyebrow}
            heading={home.pledge.heading}
            paragraphs={home.pledge.paragraphs}
            cta={home.pledge.cta}
          />
        </div>
      </section>

      <section className="section-y section-hairline px-6">
        <div className="mx-auto max-w-[1440px]">
          <TrioGrid cards={home.partnerSplit.cards} />
        </div>
      </section>

      <section className="section-y section-hairline overflow-hidden px-6">
        <div className="mx-auto grid max-w-[1440px] items-start gap-10 nav:grid-cols-2 nav:gap-12">
          <ProseBlock
            eyebrow={home.whoWeAre.eyebrow}
            heading={home.whoWeAre.heading}
            paragraphs={home.whoWeAre.paragraphs}
            cta={home.whoWeAre.cta}
          />
          <TbdImage token={home.whoWeAre.imageToken} caption="Founder portrait" />
        </div>
      </section>

      <CTABand heading={home.ctaBand.heading} body={home.ctaBand.body} cta={home.ctaBand.cta} />
    </main>
  );
}
