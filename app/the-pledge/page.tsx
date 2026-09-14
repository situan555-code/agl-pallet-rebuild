import content from "@/content/pages/the-pledge.json";
import { PageHero } from "@/components/PageHero";
import { ProseBlock } from "@/components/ProseBlock";
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
      <PageHero
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        body={content.hero.body}
      />

      <section className="section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <ProseBlock heading={content.position.heading} paragraphs={content.position.paragraphs} />
        </div>
      </section>
    </main>
  );
}
