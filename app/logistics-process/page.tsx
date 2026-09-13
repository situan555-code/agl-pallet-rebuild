import type { Metadata } from "next";
import logisticsProcess from "@/content/pages/logistics-process.json";
import { PageHero } from "@/components/PageHero";
import { TimelineSection } from "@/components/TimelineSection";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Logistics & Process - AGL Pallet",
  openGraph: {
    type: "article",
    images: ["/assets/agl_social_share.jpg"],
  },
};

export default function LogisticsProcess() {
  return (
    <main>
      <PageHero
        eyebrow={logisticsProcess.hero.eyebrow}
        heading={logisticsProcess.hero.heading}
        body={logisticsProcess.hero.body}
      />

      <TimelineSection steps={logisticsProcess.timeline} />

      <CTABand
        eyebrow={logisticsProcess.ctaBand.eyebrow}
        heading={logisticsProcess.ctaBand.heading}
        body={logisticsProcess.ctaBand.body}
        backgroundImage={logisticsProcess.ctaBand.backgroundImage}
        cta={logisticsProcess.ctaBand.cta}
      />
    </main>
  );
}
