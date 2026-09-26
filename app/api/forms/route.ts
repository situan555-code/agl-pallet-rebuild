import { NextResponse } from "next/server";
import { Resend } from "resend";
import { QUOTE_AUTORESPONSE, QUOTE_SUBJECT, QUOTE_TO, quoteSchema, coiProblem } from "@/lib/form-schema";

const MIN_MS = 3000;

function publicError(message: string) {
  return message.replace(/re_[A-Za-z0-9_]+/g, "[redacted]");
}

function notSending() {
  return NextResponse.json(
    { ok: false, error: "This form is not sending yet." },
    { status: 503 }
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const id = String(form.get("id") || "");
    const file = form.get("coi");
    if (file instanceof File && file.size > 0) {
      const problem = coiProblem(file);
      if (problem) return NextResponse.json({ ok: false, error: problem }, { status: 400 });
    }
    if (id !== "quote-form") return notSending();
    return NextResponse.json({ ok: false, error: "Quote submissions use JSON." }, { status: 400 });
  }

  let body: {
    id?: string;
    website?: string;
    startedAt?: number;
    fields?: Record<string, string>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  if (body.id !== "quote-form") return notSending();

  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_MS) {
    return NextResponse.json({ ok: false, error: "Please wait a moment and send again." }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body.fields ?? {});
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Check the required fields." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, fallback: true, error: "RESEND_API_KEY is not set." },
      { status: 503 }
    );
  }

  const quote = parsed.data;
  const to = process.env.CONTACT_TO_EMAIL?.trim() || QUOTE_TO;
  const from = process.env.RESEND_FROM?.trim() || `AGL Pallet <${QUOTE_TO}>`;
  const lines = [
    `Name: ${quote.name}`,
    `Company: ${quote.company}`,
    `Email: ${quote.email}`,
    `Phone: ${quote.phone || ""}`,
    `Pallet size or spec: ${quote.spec}`,
    `Quantity and frequency: ${quote.quantity}`,
    `Ship-to city and state: ${quote.shipTo}`,
    `Target date: ${quote.targetDate || ""}`,
    `Notes: ${quote.notes || ""}`,
    "Source: /request-a-quote/",
  ];

  const resend = new Resend(process.env.RESEND_API_KEY);
  const sent = await resend.emails.send({
    from,
    to,
    replyTo: quote.email,
    subject: QUOTE_SUBJECT,
    text: lines.join("\n"),
  });

  if (sent.error) {
    const message = publicError(sent.error.message || "Resend rejected the message.");
    const fallback = /domain|verif|from|sender|authorized|forbidden/i.test(message);
    return NextResponse.json({ ok: false, fallback, error: message }, { status: fallback ? 502 : 502 });
  }

  await resend.emails.send({
    from,
    to: quote.email,
    subject: QUOTE_SUBJECT,
    text: QUOTE_AUTORESPONSE,
  }).catch(() => undefined);

  return NextResponse.json({ ok: true, id: sent.data?.id ?? null });
}
