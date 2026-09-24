import type { Metadata } from "next";
import { ResourceArticle } from "@/components/resources/ResourceArticle";
import { ToolList } from "@/components/resources/CalculatorPage";
import { getGuide } from "@/lib/resource-pillars";
import { pageMeta } from "@/lib/seo";

const guide = getGuide("pallet-calculators")!;

export const metadata: Metadata = pageMeta(guide.metaTitle, guide.metaDescription, `/resources/${guide.slug}/`);

// Hub for the calculators; each tool is its own page (the truckload tool
// lives on the pallets-per-truckload guide).
export default function PalletCalculatorsPage() {
  return (
    <ResourceArticle
      pillar={guide}
      extraAfter="how-they-work"
      extraToc={[{ id: "tools", label: "The calculators" }]}
      extra={<ToolList />}
    />
  );
}
