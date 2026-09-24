import { NextResponse } from "next/server";
import { ppiCsv } from "@/lib/ppi-dataset";

export const runtime = "nodejs";
export const dynamic = "force-static";

/** CSV distribution for the prices-guide Dataset. Same file as content/resources/data/ppi.json. */
export function GET() {
  return new NextResponse(ppiCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ppi.csv"',
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
