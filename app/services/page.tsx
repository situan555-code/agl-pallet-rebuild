import Image from "next/image";
import data from "@/content/pages/services.json";
import { Hero3 } from "@/components/hero3";
import { Feature1 } from "@/components/feature1";
import { Feature3 } from "@/components/feature3";
import { ImageBand } from "@/components/ImageBand";
import { Cta4 } from "@/components/cta4";
import { getBlurDataURL } from "@/lib/blur";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

const SERVICE_PHOTOS: Record<string, string> = {
  "spec-sourcing": "/assets/stock/agl-pallet-01_7a54.webp",
  "mill-qualification": "/assets/stock/agl-filler-pallet-stack-04_01bd.webp",
  "managed-freight": "/assets/stock/agl-carriers-02_7e71.webp",
  "program-coordination": "/assets/stock/agl-warehouse-multiplant-01_d566.webp",
};

export const metadata: Metadata = pageMeta(
  "Services — AGL Pallet",
  "Pallet sourcing, mill qualification, managed freight, and program coordination from one brokerage desk.",
  "/services/",
);

export default function ServicesPage() {
  const blur = getBlurDataURL("/assets/product_page-engineered_pallet_solutions_sidepic-1.jpg");
  return (
    <main>
      <Hero3 eyebrow={data.hero.eyebrow} heading={data.hero.heading} description={data.hero.body} />
      <Feature3
        hairline
        variant="numbered"
        columns={2}
        features={data.services.map((s) => ({
          id: s.id,
          eyebrow: s.eyebrow,
          title: s.title,
          description: s.description,
          src: SERVICE_PHOTOS[s.id],
          href:
            s.id === "spec-sourcing"
              ? "/products/"
              : s.id === "mill-qualification"
                ? "/partners/suppliers/"
                : s.id === "managed-freight"
                  ? "/partners/carriers/"
                  : "/how-we-work/",
        }))}
      />
      <ImageBand
        eyebrow="Brokerage, not manufacturing"
        heading="We grow by coordinating more — never by owning a mill."
        body="After the lumber shock, too many brokers became competitors to the shops they used to buy from. AGL's pledge is the operating model: no plant of our own to feed."
        image={{ src: "/assets/stock/agl-filler-pallet-stack-03_3ef4.webp", alt: "Pallet stacks ready for dispatch" }}
        cta={{ label: "Read the pledge", href: "/the-pledge/" }}
      />
      <Feature1
        hairline
        eyebrow={data.detail.eyebrow}
        heading={data.detail.heading}
        paragraphs={data.detail.paragraphs}
        cta={data.detail.cta}
        media={
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-card">
            <Image
              src="/assets/product_page-engineered_pallet_solutions_sidepic-1.jpg"
              alt=""
              fill
              quality={70}
              sizes="(min-width: 980px) 38vw, 100vw"
              className="object-cover"
              placeholder={blur ? "blur" : undefined}
              blurDataURL={blur}
            />
          </div>
        }
      />
      <Cta4 heading={data.ctaBand.heading} description={data.ctaBand.body} button={data.ctaBand.cta} />
    </main>
  );
}
