import type { Metadata } from "next";
import content from "@/content/pages/products.json";
import { Hero3 } from "@/components/hero3";
import { Cta4 } from "@/components/cta4";
import { InsetReveal, InsetRevealGroup } from "@/components/InsetReveal";
import { containerClass } from "@/components/Container";
import { PRODUCT_IMAGES } from "@/lib/product-images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products — Pallets, Crates, Dunnage, Blocks and Stakes",
  description:
    "Stock pallets, custom and engineered solutions, crates, dunnage, shipping blocks, and stakes, sourced through qualified mills.",
  alternates: { canonical: "/products/" },
};

export default function Products() {
  return (
    <main>
      <Hero3 variant="light-text" eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      <section className="section-y">
        <InsetRevealGroup className={cn(containerClass, "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3")}>
          {content.lines.map((line) => {
            const href =
              line.id === "custom-engineered"
                ? "/custom-engineered/"
                : "/request-a-quote/";
            const image = PRODUCT_IMAGES[line.id] ?? "/assets/product_page-stock_pallets_sidepic.jpg";
            return (
              <InsetReveal
                key={line.id}
                id={line.id}
                heading={line.heading}
                body={line.copy}
                href={href}
                actionLabel={line.cta?.label ?? content.ctaBand.cta.label}
                image={image}
              />
            );
          })}
        </InsetRevealGroup>
      </section>

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
