import data from "@/content/pages/case-studies.json";
import Image from "next/image";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Gallery4 } from "@/components/gallery4";
import { Cta4 } from "@/components/cta4";
import { OhioPlantMap } from "@/components/OhioPlantMap";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...pageMeta(
    "Case Studies — AGL Pallet",
    "How AGL sources a spec, qualifies more than one shop, and books the freight.",
    "/case-studies/",
  ),
  robots: { index: false, follow: false },
};

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
        title="Programs"
        description="Food packaging, engineered oversize, multi-plant supply, and crate and dunnage."
        items={data.studies.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.summary,
          href: s.href,
          visual: s.id === "multi-plant-program"
            ? <OhioPlantMap className="aspect-[4/3] w-full overflow-hidden rounded-t-card bg-green" />
            : s.image
              ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-card">
                  <Image src={s.image} alt={s.title} fill sizes="(min-width: 980px) 30vw, 100vw" className="object-cover" />
                </div>
              )
              : undefined,
        }))}
      />
      <Cta4 heading={data.ctaBand.heading} description={data.ctaBand.body} button={data.ctaBand.cta} />
    </main>
  );
}
