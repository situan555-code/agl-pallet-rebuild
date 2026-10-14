import type { Metadata } from "next";
import content from "@/content/pages/products.json";
import custom from "@/content/pages/custom-engineered.json";
import { LAUNCH_LITE } from "@/lib/launch";
import { Hero3 } from "@/components/hero3";
import { Cta4 } from "@/components/cta4";
import { CardMedia } from "@/components/CardMedia";
import { InteractiveCard } from "@/components/InteractiveCard";
import { containerClass } from "@/components/Container";
import { DEMO_PRODUCT_PHOTOS } from "@/lib/demo-product-photos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wood Pallets, Crates and Dunnage for Manufacturers | AGL",
  description:
    "Wood pallets, crates, dunnage, shipping blocks, and stakes for manufacturers, sourced through qualified mills.",
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
              line.id === "custom-engineered" && !LAUNCH_LITE ? "/custom-engineered/" : "/request-a-quote/";
            return (
              <InteractiveCard key={line.id} id={line.id} href={href}>
                <CardMedia
                  priority={line.id === "stock-pallets"}
                  alt={
                    line.id === "custom-engineered"
                      ? "Technical blueprint of a standard stringer pallet"
                      : line.heading
                  }
                  src={DEMO_PRODUCT_PHOTOS[line.id]}
                />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-[22px] font-semibold leading-snug text-current">{line.heading}</h2>
                  {LAUNCH_LITE && line.id === "custom-engineered" ? (
                    <p className="mt-3 text-body text-current">{custom.hero.heading}</p>
                  ) : null}
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
