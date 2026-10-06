import content from "@/content/pages/how-we-work.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

const HOW_WE_WORK_IMAGES = [
  "/assets/stock/agl-geometry-wood-01_6d47.webp",
  "/assets/stock/agl-mill-lumber-01_0b74.webp",
  "/assets/stock/agl-freight-execute-01_0e78.webp",
  "/assets/stock/agl-broken-pallet-01_b7dc.webp",
] as const;

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
        steps={content.timeline.map((step, index) => ({
          number: step.number,
          title: step.heading,
          description: step.body,
          image: HOW_WE_WORK_IMAGES[index],
          href:
            step.number === "01"
              ? "/request-a-quote/"
              : step.number === "02"
                ? "/services/"
                : step.number === "03"
                  ? "/contact/"
                  : "/request-a-quote/",
        }))}
      />

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
