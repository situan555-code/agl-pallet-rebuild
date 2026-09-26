import Image from "next/image";
import home from "@/content/pages/home.json";
import products from "@/content/pages/products.json";
import { HeroExpand } from "@/components/HeroExpand";
import { Feature1 } from "@/components/feature1";
import { Feature2 } from "@/components/feature2";
import { Feature3 } from "@/components/feature3";
import { StaticGallery } from "@/components/home/StaticGallery";
import { StaticImageBand } from "@/components/home/StaticImageBand";
import { Cta4 } from "@/components/cta4";
import { NetworkSlot } from "@/components/home/NetworkSlot";
import { StaticNetwork } from "@/components/home/StaticNetwork";
import { Container } from "@/components/Container";
import { CardMedia } from "@/components/CardMedia";
import { InteractiveCard } from "@/components/InteractiveCard";
import { CARD_PLACEHOLDER, PRODUCT_IMAGES } from "@/lib/product-images";
import { getBlurDataURL } from "@/lib/blur";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

const CAPABILITY_HREFS = ["/request-a-quote/", "/request-a-quote/", "/services/"] as const;
const DIFFERENTIATOR_HREFS = ["/how-we-work/", "/the-pledge/", "/who-we-are/"] as const;
const DIFFERENTIATOR_IMAGES = [
  "/assets/who_agl_is_sidepic.jpg",
  "/assets/about_page-single_point_sidepic.jpg",
  "/assets/why_agl_exist_sidepic.jpg",
] as const;

export const metadata: Metadata = pageMeta(
  "AGL Pallet — Pallet Sourcing and Managed Freight for Manufacturers",
  "AGL Pallet sources new, custom, and engineered pallets from family-run mills across the Midwest and Mid-Atlantic, and manages the freight on every order.",
  "/",
);

export default function Home() {
  const whyBlur = getBlurDataURL("/assets/why_agl_exist_sidepic.jpg");

  return (
    <main>
      <HeroExpand
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        description={home.hero.body}
        video={{ src: home.hero.video, poster: home.hero.poster }}
        buttons={home.hero.buttons.map((b) => ({ label: b.label, href: b.href }))}
      />

      <section className="section-rhythm">
        <Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {home.capability.cards.map((cap, index) => (
            <InteractiveCard key={cap.heading} href={CAPABILITY_HREFS[index] ?? "/request-a-quote/"}>
              <CardMedia src={CARD_PLACEHOLDER} numeral={String(index + 1).padStart(2, "0")} />
              <div className="flex flex-1 flex-col p-6 nav:p-8">
                <h2 className="text-[22px] font-semibold leading-snug text-current">{cap.heading}</h2>
                <p className="mt-5 max-w-sm text-body text-current/75">{cap.body}</p>
              </div>
            </InteractiveCard>
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
            <Image
              src="/assets/who_agl_is_sidepic.jpg"
              alt=""
              fill
              quality={60}
              sizes="(min-width: 980px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      />

      <NetworkSlot
        className="section-rhythm"
        mills={["Family-run mills", "Qualified shops", "More than one source"]}
        center="AGL Pallet"
        right="Your line"
      >
        <StaticNetwork
          className="section-rhythm"
          mills={["Family-run mills", "Qualified shops", "More than one source"]}
          center="AGL Pallet"
          right="Your line"
        />
      </NetworkSlot>

      <Feature3
        className="section-rhythm"
        variant="numbered"
        features={home.differentiators.cards.map((c, index) => ({
          eyebrow: c.eyebrow,
          title: c.heading,
          description: c.body,
          href: DIFFERENTIATOR_HREFS[index] ?? "/how-we-work/",
          image: DIFFERENTIATOR_IMAGES[index] ?? CARD_PLACEHOLDER,
        }))}
      />

      <StaticImageBand
        className="section-rhythm"
        eyebrow="How we work"
        heading="Coordination is the product."
        body="We qualify the shops that supply them well, hold more than one source for every spec we quote, and book the freight so the pallets land when your line needs them."
        image={{ src: "/assets/agl_home_video_poster.jpg", alt: "" }}
        cta={{ label: "See how we work", href: "/how-we-work/" }}
      />

      <StaticGallery
        className="section-rhythm"
        eyebrow="Product lines"
        title="Specced to the load. Sourced through mills that can build it."
        description="Stock, custom, crates, dunnage, blocks, and stakes — each with multiple qualified shops behind the specs we sell."
        items={products.lines.map((line) => ({
          id: line.id,
          title: line.heading,
          description: line.copy,
          href: line.id === "custom-engineered" ? "/custom-engineered/" : `/products/#${line.id}`,
          image: PRODUCT_IMAGES[line.id] ?? CARD_PLACEHOLDER,
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
        features={home.partnerSplit.cards.map((c, index) => ({
          eyebrow: c.eyebrow,
          title: c.heading,
          description: c.body,
          href: c.cta.href,
          cta: c.cta,
          image: index === 0 ? PRODUCT_IMAGES["stock-pallets"] : "/assets/home_about_photo.jpg",
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
        className="section-rhythm"
        heading={home.ctaBand.heading}
        description={home.ctaBand.body}
        button={home.ctaBand.cta}
      />
    </main>
  );
}
