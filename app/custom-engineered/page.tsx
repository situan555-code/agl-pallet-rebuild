import Image from "next/image";
import { Boxes, Layers, Package } from "lucide-react";
import content from "@/content/pages/custom-engineered.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Cta4 } from "@/components/cta4";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Custom and Engineered Pallets, Crates and Skids — AGL Pallet',
  'Odd-size, oversize, and heavy-duty pallet solutions. We spec to the load, then source the shop set up for the job.',
  '/custom-engineered/',
);

export default function CustomEngineered() {
  return (
    <main>
      <Hero3
        variant="light-image"
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.body}
        image={
          <div className="relative hidden aspect-4/3 w-full overflow-hidden rounded-card nav:block">
            <Image
              src="/assets/stock/agl-pallet-blueprint-01_a87e.webp"
              alt="Technical blueprint of a standard stringer pallet"
              fill
              quality={70}
              sizes="(min-width: 980px) 38vw, 1px"
              className="object-cover"
            />
          </div>
        }
      />

      <Process1
        heading={content.whereCustomPays.heading}
        steps={content.whereCustomPays.items.map((item, index) => ({
          title: item.lead,
          description: item.body,
          icon: [Package, Boxes, Layers][index],
          href: "/request-a-quote/",
        }))}
      />

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
