import type { Metadata } from "next";
import { Suspense } from "react";
import pageContent from "@/content/pages/request-a-quote.json";
import forms from "@/content/forms.json";
import { Form, type FormDestination } from "@/components/Form";
import { Contact2 } from "@/components/contact2";
import { Feature3 } from "@/components/feature3";

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
      <Contact2
        className="pt-36 nav:pt-40"
        eyebrow={pageContent.hero.eyebrow}
        title={pageContent.hero.heading}
        titleAs="h1"
        description={pageContent.hero.body}
      >
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
      </Contact2>

      <Feature3
        variant="card"
        columns={3}
        features={pageContent.contactInfo.map((item) => ({
          eyebrow: item.label,
          title: item.value,
          href: item.href,
        }))}
      />
    </main>
  );
}
