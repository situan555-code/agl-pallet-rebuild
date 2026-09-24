import { NextResponse } from "next/server";
import { buildDownloadPdf } from "@/lib/download-pdf";
import { requireDownload } from "@/lib/download-source";

export const runtime = "nodejs";
export const dynamic = "force-static";

export function GET() {
  const item = requireDownload("pallet-size-chart");
  const bytes = buildDownloadPdf(item.slug);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${item.pdfFilename}"`,
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
