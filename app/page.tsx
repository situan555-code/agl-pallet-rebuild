import Image from "next/image";
import home from "@/content/pages/home.json";
import { HeroExpand } from "@/components/HeroExpand";
import { Feature1 } from "@/components/feature1";
import { Feature3 } from "@/components/feature3";
import { Cta4 } from "@/components/cta4";
import { Container } from "@/components/Container";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import pages from "@/pages.json";

const meta = pages.find((p) => p.path === "/")!;
export const metadata: Metadata = pageMeta(meta.title, meta.description, "/");

const HOW_IMAGES = [
  "/assets/stock/agl-geometry-wood-01_6d47.webp",
  "/assets/stock/agl-partner-mills-01_6763.webp",
  "/assets/stock/agl-freight-execute-01_0e78.webp",
  "/assets/stock/agl-filler-pallet-stack-02_0659.webp",
] as const;

function SideImage({ src, className }: { src: string; className?: string }) {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-card">
      <Image src={src} alt="" fill quality={65} sizes="(min-width: 980px) 38vw, 100vw" className={className ?? "object-cover"} />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <HeroExpand
        tagline={home.hero.eyebrow}
        heading={home.hero.heading}
        description={home.hero.body}
        video={{ src: home.hero.video, poster: home.hero.poster }}
        buttons={home.hero.buttons.map((b) => ({ label: b.label, href: b.href }))}
      />

      <section className="pt-8 nav:pt-12" aria-label="Proof">
        <Container>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {home.proof.map((item) => (
              <li key={item.label} className="rounded-card bg-green px-6 py-8 sm:px-8">
                <p className="text-ice">
                  <span className="block text-[44px] font-semibold leading-none">{item.value}</span>{" "}
                  <span className="mt-2 block text-[18px] font-semibold leading-snug">{item.label}</span>
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Feature1
        className="section-rhythm"
        eyebrow={home.whatWeDo.eyebrow}
        heading={home.whatWeDo.heading}
        paragraphs={home.whatWeDo.paragraphs}
        media={<SideImage src="/assets/who_agl_is_sidepic.jpg" />}
      />

      <Feature1
        className="section-rhythm"
        panel
        mediaSide="left"
        eyebrow={home.whyAgl.eyebrow}
        heading={home.whyAgl.heading}
        paragraphs={home.whyAgl.paragraphs}
        media={<SideImage src="/assets/stock/agl-manufacturing-forklift-01_86f4.webp" />}
      />

      <Feature1
        className="section-rhythm"
        eyebrow={home.whoWeServe.eyebrow}
        heading={home.whoWeServe.heading}
        paragraphs={home.whoWeServe.paragraphs}
        media={<SideImage src="/assets/stock/agl-industry-building-materials-02_188a.webp" />}
      />

      <Feature3
        className="section-rhythm"
        variant="ruled"
        columns={2}
        eyebrow={home.howItWorks.eyebrow}
        heading={home.howItWorks.heading}
        features={home.howItWorks.steps.map((step, index) => ({
          title: step.heading,
          description: step.body,
          src: HOW_IMAGES[index],
        }))}
      />

      <Cta4
        className="section-rhythm"
        eyebrow={home.ctaBand.eyebrow}
        heading={home.ctaBand.heading}
        description={home.ctaBand.body}
        button={home.ctaBand.cta}
      />
    </main>
  );
}
