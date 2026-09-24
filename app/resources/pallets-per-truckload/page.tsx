import type { Metadata } from "next";
import { WebApplicationJsonLd } from "@/components/JsonLd";
import { ResourceArticle } from "@/components/resources/ResourceArticle";
import { CALCULATED_TOC, CalculatedCounts, TRUCKLOAD_TOC, TruckloadCalculator } from "@/components/resources/TruckloadCalculator";
import { getGuide } from "@/lib/resource-pillars";
import { pageMeta } from "@/lib/seo";

// Own route (not [slug]) because the calculator reads query params and
// renders its result on the server.
const guide = getGuide("pallets-per-truckload")!;
const PATH = `/resources/${guide.slug}/`;

export const metadata: Metadata = pageMeta(guide.metaTitle, guide.metaDescription, PATH);

export default function PalletsPerTruckloadPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <ResourceArticle
      pillar={guide}
      extraAfter="published-counts"
      extraToc={[CALCULATED_TOC, TRUCKLOAD_TOC]}
      extra={
        <>
          <CalculatedCounts />
          <TruckloadCalculator params={searchParams} path={PATH} />
        </>
      }
      schema={
        <WebApplicationJsonLd
          name="Pallets per truckload calculator"
          description="Estimates loaded and empty pallet counts for dry vans and containers from pallet footprint, height, weight, and payload."
          path={PATH}
        />
      }
    />
  );
}
