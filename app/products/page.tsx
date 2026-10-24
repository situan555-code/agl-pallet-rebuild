import type { Metadata } from "next";
import content from "@/content/pages/products.json";
import { Hero3 } from "@/components/hero3";
import { Cta4 } from "@/components/cta4";
import { CardMedia } from "@/components/CardMedia";
import { InteractiveCard } from "@/components/InteractiveCard";
import { containerClass } from "@/components/Container";
import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import pages from "@/pages.json";

const meta = pages.find((p) => p.path === "/products/")!;
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/products/" },
};

const PHOTOS: Record<string, string> = {
  "stock-pallets": "/assets/product_page-stock_pallets_sidepic-1.jpg",
  "engineered-pallets": "/assets/stock/agl-pallet-blueprint-01_a87e.webp",
  "crates-dunnage": "/assets/stock/agl-crates-03_1540.webp",
  "shipping-blocks": "/assets/stock/agl-shipping-blocks-01_285c.webp",
};

export default function Products() {
  return (
    <main>
      <Hero3 variant="light-text" eyebrow="Products" heading={content.hero.heading} description={content.hero.body} />

      <section className="section-y">
        <div className={cn(containerClass, "grid grid-cols-1 gap-6 md:grid-cols-2")}>
          {content.lines.map((line, index) => (
            <InteractiveCard key={line.id} id={line.id} href="/request-a-quote/">
              <CardMedia priority={index === 0} alt={line.heading} src={PHOTOS[line.id]} />
              <div className="flex flex-1 flex-col p-6 nav:p-8">
                <h2 className="text-[22px] font-semibold leading-snug text-current">{line.heading}</h2>
                <p className="mt-4 text-body font-semibold text-current">{line.lead}</p>
                <p className="mt-4 text-body text-current/75">{line.copy}</p>
                {"cta" in line && line.cta ? (
                  <span className="mt-6 inline-flex items-center gap-2 text-body font-semibold text-current">
                    {line.cta.label}
                    <ArrowIcon className="size-4" />
                  </span>
                ) : null}
              </div>
            </InteractiveCard>
          ))}
        </div>
      </section>

      <Cta4
        eyebrow={content.ctaBand.eyebrow}
        heading={content.ctaBand.heading}
        description={content.ctaBand.body}
        button={content.ctaBand.cta}
      />
    </main>
  );
}
