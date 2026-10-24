import Image from "next/image";
import content from "@/content/pages/who-we-are.json";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import pages from "@/pages.json";

const meta = pages.find((p) => p.path === "/who-we-are/")!;
export const metadata: Metadata = pageMeta(meta.title, meta.description, "/who-we-are/");

function SideImage({ src }: { src: string }) {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-card">
      <Image src={src} alt="" fill quality={65} sizes="(min-width: 980px) 38vw, 100vw" className="object-cover" />
    </div>
  );
}

export default function WhoWeAre() {
  return (
    <main>
      <Hero3
        variant="light-image"
        eyebrow="About"
        heading={content.hero.heading}
        description={[content.hero.lead, ...content.hero.paragraphs]}
        image={
          <div className="relative hidden aspect-4/3 w-full overflow-hidden rounded-card nav:block">
            <Image
              src="/assets/who_agl_is_sidepic.jpg"
              alt=""
              fill
              quality={60}
              sizes="(min-width: 980px) 38vw, 1px"
              priority
              className="object-cover"
            />
          </div>
        }
      />

      <Feature1
        eyebrow={content.fair.eyebrow}
        heading={content.fair.heading}
        paragraphs={content.fair.paragraphs}
        cta={{ label: "Request a Quote", href: "/request-a-quote/" }}
        media={<SideImage src="/assets/stock/agl-filler-pallet-stack-02_0659.webp" />}
      />

      <Feature1
        panel
        mediaSide="left"
        eyebrow={content.accountability.eyebrow}
        heading={content.accountability.heading}
        paragraphs={content.accountability.paragraphs}
        media={<SideImage src="/assets/stock/agl-partner-mills-01_6763.webp" />}
      />

      <Cta4
        eyebrow={content.ctaBand.eyebrow}
        heading={content.ctaBand.heading}
        description={content.ctaBand.body}
        button={content.ctaBand.cta}
      />
    </main>
  );
}
