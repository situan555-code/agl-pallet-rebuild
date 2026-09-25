import { NextResponse } from "next/server";

/** R7.3: Resend handler stays behind the env check until owner inboxes + key exist. */
export async function POST() {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY is not set. Forms keep FormSubmit / not-sending-yet." },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: false, error: "Resend send path not wired to inboxes yet." }, { status: 503 });
}
