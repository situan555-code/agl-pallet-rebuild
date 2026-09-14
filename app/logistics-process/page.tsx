import type { Metadata } from "next";
import logisticsProcess from "@/content/pages/logistics-process.json";
import { PageHero } from "@/components/PageHero";
import { TimelineSection } from "@/components/TimelineSection";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: 'Logistics & Process - AGL Pallet',
  description: 'How AGL Pallet sources, coordinates, and delivers truckload pallet orders—single-point accountability from manufacturer to your dock.',
  alternates: { canonical: '/logistics-process/' },
  openGraph: {
    type: 'article',
    url: '/logistics-process/',
    title: 'Logistics & Process - AGL Pallet',
    description: 'How AGL Pallet sources, coordinates, and delivers truckload pallet orders—single-point accountability from manufacturer to your dock.',
    images: ["/assets/agl_social_share.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Logistics & Process - AGL Pallet',
    description: 'How AGL Pallet sources, coordinates, and delivers truckload pallet orders—single-point accountability from manufacturer to your dock.',
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
