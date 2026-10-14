import content from "@/content/pages/faq.json";
import { Hero3 } from "@/components/hero3";
import { Faq3 } from "@/components/faq3";
import { Cta4 } from "@/components/cta4";
import { FaqPageJsonLd } from "@/components/JsonLd";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  "Pallet Buying FAQ: Lead Times, Minimums, 2-Way vs 4-Way",
  "Lead times, minimums, two-way versus four-way entry, and second-source availability for buyers working with a pallet supplier.",
  "/faq/",
);

export default function Faq() {
  return (
    <main>
      <FaqPageJsonLd items={content.items.map((item) => ({ question: item.lead, answer: item.body }))} />
      <Hero3 variant="light-text" eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      <Faq3
        id="questions"
        heading="Buyer questions"
        items={content.items.map((item, i) => ({ id: `faq-${i + 1}`, question: item.lead, answer: item.body }))}
      />

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
