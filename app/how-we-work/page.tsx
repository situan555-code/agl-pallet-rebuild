import content from "@/content/pages/how-we-work.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import pages from "@/pages.json";

const HOW_WE_WORK_IMAGES = [
  "/assets/stock/agl-geometry-wood-01_6d47.webp",
  "/assets/stock/agl-mill-lumber-01_0b74.webp",
  "/assets/stock/agl-freight-execute-01_0e78.webp",
  "/assets/stock/agl-broken-pallet-01_b7dc.webp",
] as const;

const meta = pages.find((p) => p.path === "/how-we-work/")!;
export const metadata: Metadata = pageMeta(meta.title, meta.description, "/how-we-work/");

export default function HowWeWork() {
  return (
    <main>
      <Hero3
        variant="light-text"
        eyebrow="Logistics & Process"
        heading={content.hero.heading}
        description={content.hero.body}
      />

      <Process1
        steps={content.steps.map((step, index) => ({
          title: step.heading,
          description: step.paragraphs.join("\n\n"),
          image: HOW_WE_WORK_IMAGES[index],
          priority: index === 0,
          href: "/request-a-quote/",
        }))}
      />

      <Cta4
        eyebrow={content.ctaBand.eyebrow}
        heading={content.ctaBand.heading}
        description={content.ctaBand.body}
        button={content.ctaBand.cta}
      />
    </main>
  );
}
