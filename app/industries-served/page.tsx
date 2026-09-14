import type { Metadata } from "next";
import industriesServed from "@/content/pages/industries-served.json";
import { PageHero } from "@/components/PageHero";
import { IndustryCardGrid } from "@/components/IndustryCardGrid";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: 'Industries Served - AGL Pallet',
  description: 'Pallet solutions for building materials, pharmaceuticals, plastics, chemicals, and food & beverage manufacturers that cannot risk supply disruption.',
  alternates: { canonical: '/industries-served/' },
  openGraph: {
    type: 'article',
    url: '/industries-served/',
    title: 'Industries Served - AGL Pallet',
    description: 'Pallet solutions for building materials, pharmaceuticals, plastics, chemicals, and food & beverage manufacturers that cannot risk supply disruption.',
    images: ["/assets/agl_social_share.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Industries Served - AGL Pallet',
    description: 'Pallet solutions for building materials, pharmaceuticals, plastics, chemicals, and food & beverage manufacturers that cannot risk supply disruption.',
    images: ["/assets/agl_social_share.jpg"],
  },
};

export default function IndustriesServed() {
  return (
    <main>
      <PageHero
        eyebrow={industriesServed.hero.eyebrow}
        heading={industriesServed.hero.heading}
        body={industriesServed.hero.body}
      />

      <IndustryCardGrid
        eyebrow={industriesServed.industries.eyebrow}
        heading={industriesServed.industries.heading}
        cards={industriesServed.industries.cards}
        theme={industriesServed.industries.theme as "light" | "dark"}
      />

      <CTABand
        eyebrow={industriesServed.ctaBand.eyebrow}
        heading={industriesServed.ctaBand.heading}
        body={industriesServed.ctaBand.body}
        backgroundImage={industriesServed.ctaBand.backgroundImage}
        cta={industriesServed.ctaBand.cta}
      />
    </main>
  );
}
