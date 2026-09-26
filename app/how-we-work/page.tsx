import content from "@/content/pages/how-we-work.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'How We Work — AGL Pallet',
  'Four steps: understand the requirement, align supply and freight, execute and communicate, keep adjusting.',
  '/how-we-work/',
);

export default function HowWeWork() {
  return (
    <main>
      <Hero3 variant="light-text" eyebrow={content.hero.eyebrow} heading={content.hero.heading} />

      <Process1
        steps={content.timeline.map((step) => ({
          number: step.number,
          title: step.heading,
          description: step.body,
        }))}
      />

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
