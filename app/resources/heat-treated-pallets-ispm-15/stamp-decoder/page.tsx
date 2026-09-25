import type { Metadata } from "next";
import { StampDecoderPage } from "@/components/resources/StampDecoder";
import { STAMP_DECODER_PATH } from "@/lib/download-source";
import { pageMeta } from "@/lib/seo";
import { decodeStampParams, stampDecoderCopy } from "@/lib/stamp-decoder";

export const metadata: Metadata = pageMeta(
  stampDecoderCopy.metaTitle,
  stampDecoderCopy.metaDescription,
  STAMP_DECODER_PATH
);

export default async function StampDecoderRoute(
  props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }
) {
  const searchParams = await props.searchParams;
  return <StampDecoderPage result={decodeStampParams(searchParams)} />;
}
