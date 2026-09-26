import type { Metadata } from "next";
import Link from "next/link";
import content from "@/content/pages/products.json";
import { Hero3 } from "@/components/hero3";
import { Cta4 } from "@/components/cta4";
import { DeferredCardImage } from "@/components/DeferredCardImage";
import { containerClass } from "@/components/Container";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Products — Pallets, Crates, Dunnage, Blocks and Stakes",
  description:
    "Stock pallets, custom and engineered solutions, crates, dunnage, shipping blocks, and stakes, sourced through qualified mills.",
  alternates: { canonical: "/products/" },
};

const PRODUCT_IMAGES: Record<string, string> = {
  "stock-pallets": "/assets/product_page-stock_pallets_sidepic.jpg",
  "custom-engineered": "/assets/product_page-engineered_pallet_solutions_sidepic-1.jpg",
  crates: "/assets/product_page-stock_pallets_sidepic-1.jpg",
  dunnage: "/assets/product_page-stock_pallets_sidepic-1-1.jpg",
  "shipping-blocks": "/assets/about_page-single_point_sidepic.jpg",
  stakes: "/assets/why_agl_exist_sidepic.jpg",
};

export default function Products() {
  return (
    <main>
      <Hero3 variant="light-text" eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      <section className="section-y">
        <div className={cn(containerClass, "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3")}>
          {content.lines.map((line, index) => {
            const href = line.id === "custom-engineered" ? "/custom-engineered/" : undefined;
            const image = PRODUCT_IMAGES[line.id] ?? "/assets/product_page-stock_pallets_sidepic.jpg";
            const inner = (
              <>
                <div className="relative aspect-4/3 overflow-hidden bg-smoke">
                  <DeferredCardImage src={image} eager={index === 0} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-[22px] font-semibold leading-snug text-current">{line.heading}</h2>
                  <p className="mt-5 text-body text-current/75">{line.copy}</p>
                </div>
              </>
            );
            const cardClass =
              "hover-lift flex h-full flex-col overflow-hidden rounded-card border border-smoke bg-green text-bone";
            return href ? (
              <Link key={line.id} id={line.id} href={href} prefetch={false} className={cardClass}>
                {inner}
              </Link>
            ) : (
              <article key={line.id} id={line.id} className={cardClass}>
                {inner}
              </article>
            );
          })}
        </div>
      </section>

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
