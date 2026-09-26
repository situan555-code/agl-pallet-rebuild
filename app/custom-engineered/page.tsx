import { Layers, Package, Warehouse } from "lucide-react";
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
      <Hero3 eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.body} />

      <Process1
        heading={content.whereCustomPays.heading}
        steps={content.whereCustomPays.items.map((item, index) => ({
          title: item.lead,
          description: item.body,
          icon: [Package, Warehouse, Layers][index],
        }))}
      />

      <Cta4 heading={content.ctaBand.heading} description={content.ctaBand.body} button={content.ctaBand.cta} />
    </main>
  );
}
