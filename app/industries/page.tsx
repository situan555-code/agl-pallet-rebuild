import content from "@/content/pages/industries.json";
import { Hero3 } from "@/components/hero3";
import { Feature3 } from "@/components/feature3";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import pages from "@/pages.json";

const meta = pages.find((p) => p.path === "/industries/")!;
export const metadata: Metadata = pageMeta(meta.title, meta.description, "/industries/");

export default function Industries() {
  return (
    <main>
      <Hero3 eyebrow="Industries Served" heading={content.hero.heading} description={content.hero.body} />

      <Feature3
        variant="ruled"
        columns={2}
        heading={content.section.heading}
        features={content.industries.map((item, index) => ({
          title: item.heading,
          description: item.body,
          src: item.image,
          priority: index === 0,
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
