import type { Metadata } from "next";
import content from "@/content/pages/products.json";
import { PageHero } from "@/components/PageHero";
import { ProseBlock } from "@/components/ProseBlock";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Products — Pallets, Crates, Dunnage, Blocks and Stakes",
  description:
    "Stock pallets, custom and engineered solutions, crates, dunnage, shipping blocks, and stakes, sourced through qualified mills.",
  alternates: { canonical: "/products/" },
};

export default function Products() {
  return (
    <main>
      <PageHero
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        body={content.hero.body}
      />

      {content.lines.map((line, i) => (
        <section
          key={line.id}
          id={line.id}
          className={`scroll-mt-24 section-y px-6 ${i % 2 === 0 ? "bg-surface" : "bg-white"}`}
        >
          <div className="mx-auto max-w-[1440px]">
            <ProseBlock heading={line.heading} paragraphs={[line.copy]} cta={"cta" in line ? line.cta : undefined} />
          </div>
        </section>
      ))}

      <CTABand
        heading={content.ctaBand.heading}
        body={content.ctaBand.body}
        cta={content.ctaBand.cta}
      />
    </main>
  );
}
