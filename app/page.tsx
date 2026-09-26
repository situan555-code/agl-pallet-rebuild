import home from "@/content/pages/home.json";
import products from "@/content/pages/products.json";
import { HeroExpand } from "@/components/HeroExpand";
import { Feature1 } from "@/components/feature1";
import { Feature2 } from "@/components/feature2";
import { Feature3 } from "@/components/feature3";
import { StaticGallery } from "@/components/home/StaticGallery";
import { Cta4 } from "@/components/cta4";
import { NetworkSlot } from "@/components/home/NetworkSlot";
import { StaticNetwork } from "@/components/home/StaticNetwork";
import { Container } from "@/components/Container";
import { FlowAnchor, FlowPage } from "@/components/flow/FlowPage";
import { PhotoChapter } from "@/components/flow/PhotoChapter";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  "AGL Pallet — Pallet Sourcing and Managed Freight for Manufacturers",
  "AGL Pallet sources new, custom, and engineered pallets from family-run mills across the Midwest and Mid-Atlantic, and manages the freight on every order.",
  "/",
);

export default function Home() {
  return (
    <FlowPage>
      <main>
        <FlowAnchor glow="hero">
          <HeroExpand
            eyebrow={home.hero.eyebrow}
            heading={home.hero.heading}
            description={home.hero.body}
            video={{ src: home.hero.video, poster: home.hero.poster }}
            buttons={home.hero.buttons.map((b) => ({ label: b.label, href: b.href }))}
          />
        </FlowAnchor>

        <section className="section-rhythm">
          <Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {home.capability.cards.map((cap) => (
              <article key={cap.heading} className="hover-lift rounded-card bg-green px-8 py-10 text-bone nav:px-10">
                <h2 className="min-h-[2lh] text-display-kicker text-current lg:min-h-[2lh]">{cap.heading}</h2>
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
        />

        <PhotoChapter src="/assets/who_agl_is_sidepic.jpg" />

        <FlowAnchor glow="network">
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
        </FlowAnchor>

        <Feature3
          className="section-rhythm"
          variant="numbered"
          features={home.differentiators.cards.map((c) => ({
            eyebrow: c.eyebrow,
            title: c.heading,
            description: c.body,
          }))}
        />

        <Feature1
          className="section-rhythm flow-hairline"
          eyebrow="How we work"
          heading="Coordination is the product."
          paragraphs={[
            "We qualify the shops that supply them well, hold more than one source for every spec we quote, and book the freight so the pallets land when your line needs them.",
          ]}
          cta={{ label: "See how we work", href: "/how-we-work/" }}
        />

        <PhotoChapter src="/assets/agl_home_video_poster.jpg" />

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
          }))}
        />

        <Feature2
          className="section-rhythm flow-hairline"
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
          className="section-rhythm flow-hairline"
          eyebrow={home.whoWeAre.eyebrow}
          heading={home.whoWeAre.heading}
          paragraphs={home.whoWeAre.paragraphs}
          cta={home.whoWeAre.cta}
        />

        <PhotoChapter src="/assets/why_agl_exist_sidepic.jpg" />

        <FlowAnchor glow="cta">
          <Cta4
            className="section-rhythm"
            heading={home.ctaBand.heading}
            description={home.ctaBand.body}
            button={home.ctaBand.cta}
          />
        </FlowAnchor>
      </main>
    </FlowPage>
  );
}
