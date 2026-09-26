import Image from "next/image";
import home from "@/content/pages/home.json";
import products from "@/content/pages/products.json";
import { HeroExpand } from "@/components/HeroExpand";
import { Feature1 } from "@/components/feature1";
import { Feature2 } from "@/components/feature2";
import { Feature3 } from "@/components/feature3";
import { Gallery4Loader } from "@/components/Gallery4Loader";
import { DeferredFillImage } from "@/components/DeferredFillImage";
import { DeferredImageBand } from "@/components/home/DeferredImageBand";
import { Cta4 } from "@/components/cta4";
import { DeferredNetwork } from "@/components/home/DeferredNetwork";
import { Container } from "@/components/Container";
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
      <link
        rel="preload"
        as="image"
        href={home.hero.poster}
        fetchPriority="high"
      />
      <HeroExpand
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        description={home.hero.body}
        video={{ src: home.hero.video, poster: home.hero.poster }}
        buttons={home.hero.buttons.map((b) => ({ label: b.label, href: b.href }))}
      />

      <section className="section-rhythm">
        <Container className="grid gap-4 md:grid-cols-3">
          {home.capability.cards.map((cap) => (
            <article key={cap.heading} className="hover-lift rounded-card bg-green px-8 py-10 text-bone nav:px-10">
              <h2 className="text-display-kicker text-current">{cap.heading}</h2>
              <p className="mt-5 max-w-sm text-body text-current/75">{cap.body}</p>
            </article>
          ))}
        </Container>
      </section>

      <Feature1
        className="section-rhythm"
        eyebrow={home.whatWeDo.eyebrow}
        heading={home.whatWeDo.heading}
        paragraphs={home.whatWeDo.paragraphs}
        media={
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-card">
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

      <DeferredNetwork
        className="section-rhythm"
        mills={["Family-run mills", "Qualified shops", "More than one source"]}
        center="AGL Pallet"
        right="Your line"
      />

      <Feature3
        className="section-rhythm"
        variant="numbered"
        features={home.differentiators.cards.map((c) => ({
          eyebrow: c.eyebrow,
          title: c.heading,
          description: c.body,
        }))}
      />

      <DeferredImageBand
        className="section-rhythm"
        eyebrow="How we work"
        heading="Coordination is the product."
        body="We qualify the shops that supply them well, hold more than one source for every spec we quote, and book the freight so the pallets land when your line needs them."
        image={{ src: "/assets/agl_home_video_poster.jpg", alt: "" }}
        cta={{ label: "See how we work", href: "/how-we-work/" }}
      />

      <Gallery4Loader
        className="section-rhythm"
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
        className="section-rhythm"
        eyebrow={home.pledge.eyebrow}
        heading={home.pledge.heading}
        paragraphs={home.pledge.paragraphs}
        cta={home.pledge.cta}
      />

      <Feature3
        className="section-rhythm"
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
        className="section-rhythm"
        panel
        mediaSide="left"
        eyebrow={home.whoWeAre.eyebrow}
        heading={home.whoWeAre.heading}
        paragraphs={home.whoWeAre.paragraphs}
        cta={home.whoWeAre.cta}
        media={
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-card">
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
        className="section-rhythm section-rhythm-end"
        heading={home.ctaBand.heading}
        description={home.ctaBand.body}
        button={home.ctaBand.cta}
      />
    </main>
  );
}
