import type { Metadata } from "next";
import content from "@/content/pages/products.json";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Cta4 } from "@/components/cta4";

export const metadata: Metadata = {
  title: "Products — Pallets, Crates, Dunnage, Blocks and Stakes",
  description:
    "Stock pallets, custom and engineered solutions, crates, dunnage, shipping blocks, and stakes, sourced through qualified mills.",
  alternates: { canonical: "/products/" },
};

export default function Products() {
  return (
    <main>
      <Hero3 eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      {content.lines.map((line, i) => (
        <Feature1
          key={line.id}
          id={line.id}
          hairline={i > 0}
          heading={line.heading}
          paragraphs={[line.copy]}
          cta={"cta" in line ? line.cta : undefined}
        />
      ))}

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
