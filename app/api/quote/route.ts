import { NextResponse } from "next/server";

// Quote delivery is handled client-side via FormSubmit (see ContactForm).
// Vercel serverless IPs are Cloudflare-blocked by FormSubmit, so this route
// must not pretend to send. Kept so old clients get a clear error.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Quote form posts from the browser via FormSubmit. Reload /request-a-quote/ and submit again.",
    },
    { status: 410 },
  );
}
