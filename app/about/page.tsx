import type { Metadata } from "next";
import Image from "next/image";
import about from "@/content/pages/about.json";
import { TextWithSideImage } from "@/components/TextWithSideImage";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { IndustryCardGrid } from "@/components/IndustryCardGrid";
import { CTABand } from "@/components/CTABand";
import { getBlurDataURL } from "@/lib/blur";

const HERO_IMAGE = "/assets/home_header_image.jpg";

export const metadata: Metadata = {
  title: "About - AGL Pallet",
  openGraph: {
    type: "article",
    images: ["/assets/agl_social_share.jpg"],
  },
};

export default function About() {
  return (
    <main>
      <section className="relative flex min-h-[500px] items-center overflow-hidden pt-[119px]">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
          placeholder={getBlurDataURL(HERO_IMAGE) ? "blur" : undefined}
          blurDataURL={getBlurDataURL(HERO_IMAGE)}
        />
        <div className="absolute inset-0 bg-brand-green/70" />
        <div className="relative mx-auto max-w-[1440px] px-6 py-16 text-white">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {about.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-display-1">{about.hero.heading}</h1>
          {about.hero.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-6 max-w-2xl text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <TextWithSideImage
        eyebrow={about.whoAglServes.eyebrow}
        heading={about.whoAglServes.heading}
        paragraphs={about.whoAglServes.paragraphs}
        image={about.whoAglServes.image}
        alt={about.whoAglServes.alt}
        imageSide={about.whoAglServes.imageSide as "left" | "right"}
        cta={about.whoAglServes.cta}
      />

      <EmbeddedVideo
        src={about.video.src}
        controls={about.video.controls}
        autoPlay={about.video.autoPlay}
        muted={about.video.muted}
        loop={about.video.loop}
      />

      <IndustryCardGrid
        eyebrow={about.industries.eyebrow}
        heading={about.industries.heading}
        cards={about.industries.cards}
        theme={about.industries.theme as "light" | "dark"}
      />

      <TextWithSideImage
        eyebrow={about.singlePointOfContact.eyebrow}
        heading={about.singlePointOfContact.heading}
        paragraphs={about.singlePointOfContact.paragraphs}
        image={about.singlePointOfContact.image}
        alt={about.singlePointOfContact.alt}
        imageSide={about.singlePointOfContact.imageSide as "left" | "right"}
        cta={about.singlePointOfContact.cta}
      />

      <CTABand
        eyebrow={about.ctaBand.eyebrow}
        heading={about.ctaBand.heading}
        body={about.ctaBand.body}
        backgroundImage={about.ctaBand.backgroundImage}
        cta={about.ctaBand.cta}
      />
    </main>
  );
}
