import type { Metadata } from "next";
import { DatasetJsonLd } from "@/components/JsonLd";
import { ResourceArticle } from "@/components/resources/ResourceArticle";
import { PRICE_INDEX_TOC, PriceIndex } from "@/components/resources/PriceIndex";
import { getGuide } from "@/lib/resource-pillars";
import { pageMeta } from "@/lib/seo";

const guide = getGuide("pallet-prices")!;

export const metadata: Metadata = pageMeta(guide.metaTitle, guide.metaDescription, `/resources/${guide.slug}/`);

export default function PalletPricesPage() {
  return (
    <ResourceArticle
      pillar={guide}
      extraAfter="how-the-index-works"
      extraToc={[PRICE_INDEX_TOC]}
      extra={<PriceIndex />}
      schema={<DatasetJsonLd />}
    />
  );
}
