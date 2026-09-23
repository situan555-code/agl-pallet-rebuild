import home from "@/content/pages/home.json";
import { Hero1 } from "@/components/hero1";
import { Feature1 } from "@/components/feature1";
import { Feature2 } from "@/components/feature2";
import { Feature3 } from "@/components/feature3";
import { Cta4 } from "@/components/cta4";
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
      <Hero1
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        description={home.hero.body}
        image={{ src: home.hero.image, alt: "" }}
        buttons={home.hero.buttons as { label: string; href: string; variant: "pill-light" | "ghost-light" }[]}
      />

      <Feature3
        variant="divided"
        features={home.capability.cards.map((c) => ({ title: c.heading, description: c.body }))}
      />

      <Feature1
        hairline
        eyebrow={home.whatWeDo.eyebrow}
        heading={home.whatWeDo.heading}
        paragraphs={home.whatWeDo.paragraphs}
      />

      <Feature3
        hairline
        variant="numbered"
        features={home.differentiators.cards.map((c) => ({
          eyebrow: c.eyebrow,
          title: c.heading,
          description: c.body,
        }))}
      />

      <Feature2
        eyebrow={home.pledge.eyebrow}
        heading={home.pledge.heading}
        paragraphs={home.pledge.paragraphs}
        cta={home.pledge.cta}
      />

      <Feature3
        hairline
        variant="card"
        columns={2}
        features={home.partnerSplit.cards.map((c) => ({
          eyebrow: c.eyebrow,
          title: c.heading,
          description: c.body,
          cta: c.cta,
        }))}
      />

      <Feature1
        hairline
        eyebrow={home.whoWeAre.eyebrow}
        heading={home.whoWeAre.heading}
        paragraphs={home.whoWeAre.paragraphs}
        cta={home.whoWeAre.cta}
        media={<TbdImage token={home.whoWeAre.imageToken} caption="Founder portrait" />}
      />

      <Cta4 heading={home.ctaBand.heading} description={home.ctaBand.body} button={home.ctaBand.cta} />
    </main>
  );
}
