import content from "@/content/pages/how-we-work.json";
import { PageHero } from "@/components/PageHero";
import { TimelineSection } from "@/components/TimelineSection";
import { CTABand } from "@/components/CTABand";
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
      <PageHero eyebrow={content.hero.eyebrow} heading={content.hero.heading} />

      <TimelineSection steps={content.timeline} />

      <CTABand
        heading={content.ctaBand.heading}
        body={content.ctaBand.body}
        cta={content.ctaBand.cta}
      />
    </main>
  );
}
