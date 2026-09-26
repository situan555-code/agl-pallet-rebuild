import { BadgeCheck, Clock, Handshake, Settings2 } from "lucide-react";
import content from "@/content/pages/who-we-are.json";
import home from "@/content/pages/home.json";
import { Hero3 } from "@/components/hero3";
import { DeferredFillImage } from "@/components/DeferredFillImage";
import { Feature1 } from "@/components/feature1";
import { Process1 } from "@/components/process1";
import { Feature3 } from "@/components/feature3";
import { About3 } from "@/components/about3";
import { Cta4 } from "@/components/cta4";
import { TbdImage } from "@/components/TbdImage";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Who We Are — AGL Pallet',
  'AGL Pallet started on the buying side of the dock. North Canton, Ohio. Here is how the company runs and who answers the phone.',
  '/who-we-are/',
);

export default function WhoWeAre() {
  return (
    <main>
      <Hero3
        variant="light-image"
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.paragraphs}
        image={
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-card">
            <DeferredFillImage
              src="/assets/who_agl_is_sidepic.jpg"
              alt=""
              quality={60}
              sizes="(min-width: 980px) 38vw, calc(100vw - 80px)"
              className="object-cover"
            />
          </div>
        }
      />

      <Feature1
        eyebrow={content.founderStory.eyebrow}
        heading={content.founderStory.heading}
        paragraphs={content.founderStory.paragraphs}
        media={<TbdImage caption="Founder portrait" />}
      />

      <Process1
        layout="team"
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
        className="section-y"
        features={content.values.cards.map((c, index) => ({
          title: c.heading,
          description: c.body,
          icon: [Handshake, Clock, Settings2, BadgeCheck][index],
        }))}
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
          },
        ]}
      />

      <Cta4 heading={home.ctaBand.heading} description={home.ctaBand.body} button={home.ctaBand.cta} />
    </main>
  );
}
