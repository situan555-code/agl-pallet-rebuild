import type { Metadata } from "next";
import { DownloadsIndexPage } from "@/components/resources/DownloadPages";
import { DOWNLOADS_PATH, downloadsIndex } from "@/lib/download-source";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(downloadsIndex.metaTitle, downloadsIndex.metaDescription, DOWNLOADS_PATH);

export default function DownloadsPage() {
  return <DownloadsIndexPage />;
}
