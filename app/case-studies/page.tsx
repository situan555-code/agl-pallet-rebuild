import data from "@/content/pages/case-studies.json";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Gallery4 } from "@/components/gallery4";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  "Case Studies — AGL Pallet",
  "Structural case studies for AGL Pallet's sourcing and managed freight work. Verified metrics only — no invented manufacturer claims.",
  "/case-studies/",
);

export default function CaseStudiesPage() {
  return (
    <main>
      <Hero3
        eyebrow={data.hero.eyebrow}
        heading={data.hero.heading}
        description={data.hero.body}
      />
      <Feature1
        hairline
        eyebrow={data.intro.eyebrow}
        heading={data.intro.heading}
        paragraphs={data.intro.paragraphs}
      />
      <Gallery4
        tone="paper"
        eyebrow="Selected work"
        title="Programs worth the write-up — when the facts are ready."
        description="Structural examples only. Titles and outcomes stay unpublished until approved. Brokerage story only — we don't pretend to be the mill."
        items={data.studies.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.summary,
          href: s.href,
          image: s.image,
        }))}
      />
      <Cta4 heading={data.ctaBand.heading} description={data.ctaBand.body} button={data.ctaBand.cta} />
    </main>
  );
}
