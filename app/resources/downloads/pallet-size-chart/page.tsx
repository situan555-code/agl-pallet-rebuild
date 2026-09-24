import type { Metadata } from "next";
import { DownloadArticle } from "@/components/resources/DownloadPages";
import { downloadPath, requireDownload } from "@/lib/download-source";
import { pageMeta } from "@/lib/seo";

const item = requireDownload("pallet-size-chart");

export const metadata: Metadata = pageMeta(item.title + " — AGL Pallet", item.metaDescription, downloadPath(item.slug));

export default function PalletSizeChartPage() {
  return <DownloadArticle slug={item.slug} />;
}
