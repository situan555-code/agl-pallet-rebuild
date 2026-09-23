import content from "@/content/pages/the-pledge.json";
import { Hero3 } from "@/components/hero3";
import { Feature2 } from "@/components/feature2";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'The Pledge — AGL Will Never Own Manufacturing',
  'Most large pallet brokers bought factories. AGL did not, and will not. Why that decision is structural rather than a slogan.',
  '/the-pledge/',
);

export default function ThePledge() {
  return (
    <main>
      <Hero3 eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      <Feature2 heading={content.position.heading} paragraphs={content.position.paragraphs} />
    </main>
  );
}
