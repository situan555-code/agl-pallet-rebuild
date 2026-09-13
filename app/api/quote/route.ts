import { NextResponse } from "next/server";

type QuoteRequest = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  palletDimensions: string;
  palletQuantity: string;
  message: string;
};

const REQUIRED_FIELDS: (keyof QuoteRequest)[] = [
  "fullName",
  "companyName",
  "email",
  "phone",
  "palletDimensions",
  "palletQuantity",
  "message",
];

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<QuoteRequest>;

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || body[field]!.trim() === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL } = process.env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.log("[quote] RESEND_API_KEY or CONTACT_TO_EMAIL not set — logging submission instead of sending:", body);
    return NextResponse.json({ ok: true });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "AGL Pallet Website <quotes@aglpallet.com>",
    to: CONTACT_TO_EMAIL,
    replyTo: body.email,
    subject: `Quote request from ${body.fullName} (${body.companyName})`,
    text: [
      `Full Name: ${body.fullName}`,
      `Company Name: ${body.companyName}`,
      `Email Address: ${body.email}`,
      `Phone Number: ${body.phone}`,
      `Pallet Dimensions: ${body.palletDimensions}`,
      `Estimated Pallet Quantity: ${body.palletQuantity}`,
      `Message: ${body.message}`,
    ].join("\n"),
  });

  if (error) {
    console.error("[quote] Resend send failed:", error);
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
