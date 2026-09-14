import type { Metadata } from "next";
import home from "@/content/pages/home.json";
import type { HomeSection } from "@/lib/content-types";
import { Hero } from "@/components/Hero";
import { TextWithSideImage } from "@/components/TextWithSideImage";
import { StatBand } from "@/components/StatBand";
import { EmbeddedVideo } from "@/components/EmbeddedVideo";
import { ProcessStepGrid } from "@/components/ProcessStepGrid";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "AGL Pallet - For Manufacturers Who Can't Afford Disruption",
  description:
    "AGL Pallet sources and delivers truckload pallet orders through trusted manufacturers with end-to-end logistics support.",
  openGraph: {
    type: "website",
    images: ["/assets/agl_social_share.jpg"],
  },
};

export default function Home() {
  return (
    <main>
      <Hero
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        body={home.hero.body}
        image={home.hero.image}
        cta={home.hero.cta}
      />

      {(home.sections as HomeSection[]).map((section, i) => {
        if (section.type === "textWithImage") {
          return (
            <TextWithSideImage
              key={i}
              eyebrow={section.eyebrow}
              heading={section.heading}
              paragraphs={section.paragraphs}
              image={section.image}
              imageSide={section.imageSide}
              edgeShape={section.edgeShape}
              cta={section.cta}
            />
          );
        }
        if (section.type === "statBand") {
          return <StatBand key={i} stats={section.stats} />;
        }
        if (section.type === "video") {
          return (
            <EmbeddedVideo
              key={i}
              src={section.src}
              poster={section.poster}
              controls={section.controls}
              autoPlay={section.autoPlay}
              muted={section.muted}
              loop={section.loop}
            />
          );
        }
        if (section.type === "processSteps") {
          return (
            <ProcessStepGrid
              key={i}
              eyebrow={section.eyebrow}
              heading={section.heading}
              steps={section.steps}
            />
          );
        }
        if (section.type === "ctaBand") {
          return (
            <CTABand
              key={i}
              eyebrow={section.eyebrow}
              heading={section.heading}
              body={section.body}
              backgroundImage={section.backgroundImage}
              cta={section.cta}
            />
          );
        }
        return null;
      })}
    </main>
  );
}
