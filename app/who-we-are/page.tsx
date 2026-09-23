import content from "@/content/pages/who-we-are.json";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Process1 } from "@/components/process1";
import { Feature3 } from "@/components/feature3";
import { About3 } from "@/components/about3";
import { TbdImage } from "@/components/TbdImage";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Who We Are — AGL Pallet',
  'AGL Pallet was built from the manufacturing side of the dock. North Canton, Ohio. Here is how the company runs and who answers the phone.',
  '/who-we-are/',
);

export default function WhoWeAre() {
  return (
    <main>
      <Hero3 eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.paragraphs} />

      <Feature1
        eyebrow={content.founderStory.eyebrow}
        heading={content.founderStory.heading}
        paragraphs={content.founderStory.paragraphs}
        media={<TbdImage token={content.founderStory.imageToken} caption="Founder portrait" />}
      />

      <Process1
        hairline
        eyebrow={content.team.eyebrow}
        heading={content.team.heading}
        description={content.team.body}
        steps={content.team.items.map((item) => ({ title: item.lead, description: item.body }))}
      />

      <Feature3
        hairline
        variant="divided"
        columns={4}
        eyebrow={content.values.eyebrow}
        className="pt-16 nav:pt-20"
        features={content.values.cards.map((c) => ({ title: c.heading, description: c.body }))}
      />

      <About3
        hairline
        sections={[
          {
            label: content.faith.eyebrow,
            title: content.faith.heading,
            paragraphs: content.faith.paragraphs,
          },
          {
            label: content.whereWeAre.eyebrow,
            paragraphs: [content.whereWeAre.body],
            footer: <p className="text-body">{`{{${content.whereWeAre.addressToken}}}`}</p>,
          },
        ]}
      />
    </main>
  );
}
