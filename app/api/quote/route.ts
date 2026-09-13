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
  let body: Partial<QuoteRequest>;
  try {
    body = (await request.json()) as Partial<QuoteRequest>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || body[field]!.trim() === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!to) {
    console.error("[quote] CONTACT_TO_EMAIL not set — refusing silent drop");
    return NextResponse.json({ error: "mail not configured" }, { status: 503 });
  }

  // DIY delivery: FormSubmit needs only the destination email (no API key).
  // First production submit may require one activation click in that inbox.
  const payload = {
    name: body.fullName,
    email: body.email,
    phone: body.phone,
    company: body.companyName,
    _replyto: body.email,
    _subject: `Quote request from ${body.fullName} (${body.companyName})`,
    _template: "table",
    _captcha: "false",
    message: [
      `Full Name: ${body.fullName}`,
      `Company Name: ${body.companyName}`,
      `Email Address: ${body.email}`,
      `Phone Number: ${body.phone}`,
      `Pallet Dimensions: ${body.palletDimensions}`,
      `Estimated Pallet Quantity: ${body.palletQuantity}`,
      `Message: ${body.message}`,
    ].join("\n"),
  };

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let parsed: { success?: string; message?: string; error?: string } = {};
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {
    /* non-JSON error page */
  }

  if (!res.ok) {
    console.error("[quote] FormSubmit failed:", res.status, text.slice(0, 500));
    return NextResponse.json({ error: "send failed" }, { status: 502 });
  }

  // FormSubmit returns 200 with success message; activation-pending still 200.
  console.log("[quote] FormSubmit accepted:", parsed.success || parsed.message || "ok");
  return NextResponse.json({ ok: true });
}
