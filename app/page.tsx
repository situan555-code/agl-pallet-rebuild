import Image from "next/image";
import home from "@/content/pages/home.json";
import products from "@/content/pages/products.json";
import { Hero115 } from "@/components/hero115";
import { Feature1 } from "@/components/feature1";
import { Feature2 } from "@/components/feature2";
import { Feature3 } from "@/components/feature3";
import { Gallery4Loader } from "@/components/Gallery4Loader";
import { DeferredFillImage } from "@/components/DeferredFillImage";
import { ImageBand } from "@/components/ImageBand";
import { Cta4 } from "@/components/cta4";
import { getBlurDataURL } from "@/lib/blur";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  "AGL Pallet — Pallet Sourcing and Managed Freight for Manufacturers",
  "AGL Pallet sources new, custom, and engineered pallets from family-run mills across the Midwest and Mid-Atlantic, and manages the freight on every order.",
  "/",
);

const PRODUCT_IMAGES: Record<string, string> = {
  "stock-pallets": "/assets/product_page-stock_pallets_sidepic.jpg",
  "custom-engineered": "/assets/product_page-engineered_pallet_solutions_sidepic-1.jpg",
  crates: "/assets/product_page-stock_pallets_sidepic-1.jpg",
  dunnage: "/assets/product_page-stock_pallets_sidepic-1-1.jpg",
  "shipping-blocks": "/assets/about_page-single_point_sidepic.jpg",
  stakes: "/assets/why_agl_exist_sidepic.jpg",
};

export default function Home() {
  const whyBlur = getBlurDataURL("/assets/why_agl_exist_sidepic.jpg");

  return (
    <main>
      <Hero115
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        description={home.hero.body}
        video={{ src: home.hero.video, poster: home.hero.poster }}
        buttons={
          home.hero.buttons as {
            label: string;
            href: string;
            variant: "pill-light" | "ghost-light";
          }[]
        }
        capabilities={home.capability.cards.map((c) => ({
          heading: c.heading,
          body: c.body,
        }))}
      />

      <Feature1
        hairline
        eyebrow={home.whatWeDo.eyebrow}
        heading={home.whatWeDo.heading}
        paragraphs={home.whatWeDo.paragraphs}
        media={
          <div className="relative aspect-[5/6] w-full overflow-hidden rounded-sm ring-1 ring-clay/40">
            <DeferredFillImage
              src="/assets/who_agl_is_sidepic.jpg"
              alt=""
              quality={72}
              sizes="(min-width: 980px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      />

      <Feature3
        hairline
        variant="numbered"
        features={home.differentiators.cards.map((c) => ({
          eyebrow: c.eyebrow,
          title: c.heading,
          description: c.body,
        }))}
      />

      <ImageBand
        eyebrow="How we work"
        heading="Coordination is the product."
        body="We qualify the shops that supply them well, hold more than one source for every spec we quote, and book the freight so the pallets land when your line needs them."
        image={{ src: "/assets/agl_home_video_poster.jpg", alt: "" }}
        cta={{ label: "See how we work", href: "/how-we-work/" }}
      />

      <Gallery4Loader
        tone="paper"
        eyebrow="Product lines"
        title="Specced to the load. Sourced through mills that can build it."
        description="Stock, custom, crates, dunnage, blocks, and stakes — each with multiple qualified shops behind the specs we sell."
        items={products.lines.map((line) => ({
          id: line.id,
          title: line.heading,
          description: line.copy,
          href: line.id === "custom-engineered" ? "/custom-engineered/" : `/products/#${line.id}`,
          image: PRODUCT_IMAGES[line.id] ?? "/assets/product_page-stock_pallets_sidepic.jpg",
        }))}
      />

      <Feature2
        eyebrow={home.pledge.eyebrow}
        heading={home.pledge.heading}
        paragraphs={home.pledge.paragraphs}
        cta={home.pledge.cta}
      />

      <Feature3
        hairline
        variant="card"
        columns={2}
        features={home.partnerSplit.cards.map((c) => ({
          eyebrow: c.eyebrow,
          title: c.heading,
          description: c.body,
          cta: c.cta,
        }))}
      />

      <Feature1
        hairline
        eyebrow={home.whoWeAre.eyebrow}
        heading={home.whoWeAre.heading}
        paragraphs={home.whoWeAre.paragraphs}
        cta={home.whoWeAre.cta}
        media={
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm ring-1 ring-clay/40">
            <Image
              src="/assets/why_agl_exist_sidepic.jpg"
              alt=""
              fill
              quality={70}
              sizes="(min-width: 980px) 38vw, 100vw"
              className="object-cover"
              placeholder={whyBlur ? "blur" : undefined}
              blurDataURL={whyBlur}
            />
          </div>
        }
      />

      <Cta4
        heading={home.ctaBand.heading}
        description={home.ctaBand.body}
        button={home.ctaBand.cta}
      />
    </main>
  );
}
