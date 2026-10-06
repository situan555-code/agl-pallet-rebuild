import type { Metadata } from "next";
import content from "@/content/pages/products.json";
import { Hero3 } from "@/components/hero3";
import { Cta4 } from "@/components/cta4";
import { CardMedia } from "@/components/CardMedia";
import { InteractiveCard } from "@/components/InteractiveCard";
import { containerClass } from "@/components/Container";
import { DEMO_PRODUCT_PHOTOS } from "@/lib/demo-product-photos";
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
        <div className={cn(containerClass, "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3")}>
          {content.lines.map((line) => {
            const href =
              line.id === "custom-engineered"
                ? "/custom-engineered/"
                : "/request-a-quote/";
            return (
              <InteractiveCard key={line.id} id={line.id} href={href}>
                <CardMedia
                  alt={
                    line.id === "custom-engineered"
                      ? "Technical blueprint of a standard stringer pallet"
                      : line.heading
                  }
                  src={DEMO_PRODUCT_PHOTOS[line.id]}
                />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-[22px] font-semibold leading-snug text-current">{line.heading}</h2>
                  <p className="mt-5 text-body text-current/75">{line.copy}</p>
                </div>
              </InteractiveCard>
            );
          })}
        </div>
      </section>

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
