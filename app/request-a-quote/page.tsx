import type { Metadata } from "next";
import { Suspense } from "react";
import pageContent from "@/content/pages/request-a-quote.json";
import forms from "@/content/forms.json";
import { Form, type FormDestination } from "@/components/Form";
import { ContactInfoStrip } from "@/components/ContactInfoStrip";

export const metadata: Metadata = {
  title: "Request a Quote — AGL Pallet",
  description: "Send a spec and a quantity and we will come back the same day. No minimums.",
  alternates: { canonical: "/request-a-quote/" },
  openGraph: {
    type: "article",
    url: "/request-a-quote/",
    title: "Request a Quote — AGL Pallet",
    description: "Send a spec and a quantity and we will come back the same day. No minimums.",
    images: ["/assets/agl_social_share.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Request a Quote — AGL Pallet",
    description: "Send a spec and a quantity and we will come back the same day. No minimums.",
    images: ["/assets/agl_social_share.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default function RequestAQuote() {
  const to =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    pageContent.contactInfo.find((i) => i.href.startsWith("mailto:"))?.href.replace("mailto:", "") ||
    "sales@aglpallet.com";

  const destination: FormDestination = {
    kind: "formsubmit",
    email: to,
    subject: forms.quote.subject,
    autoresponse: forms.quote.autoresponse,
  };

  return (
    <main>
      <section className="scroll-mt-24 bg-brand-green px-6 pb-16 pt-36 text-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {pageContent.hero.eyebrow}
          </p>
          <h1 className="mt-4 text-display-1">{pageContent.hero.heading}</h1>
          <p className="mt-6 max-w-2xl text-body">{pageContent.hero.body}</p>
          <Suspense fallback={null}>
            <Form
              id={forms.quote.id}
              fields={forms.quote.fields as never}
              destination={destination}
              submitLabel={forms.quote.submitLabel}
              successMessage={forms.quote.successMessage}
              source="/request-a-quote/"
            />
          </Suspense>
        </div>
      </section>

      <ContactInfoStrip items={pageContent.contactInfo} />
    </main>
  );
}
