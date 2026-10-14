import { Suspense } from "react";
import type { Metadata } from "next";
import pageContent from "@/content/pages/request-a-quote.json";
import forms from "@/content/forms.json";
import type { FormDestination } from "@/components/Form";
import { Form } from "@/components/Form";
import { Contact2 } from "@/components/contact2";
import { QuoteContacts, type QuoteContactItem } from "@/components/QuoteContacts";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Request a Pallet Quote, Same-Day Response | AGL Pallet",
  "Send a spec and a quantity and we will come back the same day. No minimums.",
  "/request-a-quote/",
);

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

  const contacts: QuoteContactItem[] = pageContent.contactInfo.map((item) => ({
    kind: (item.href.startsWith("mailto:")
      ? "email"
      : item.href.startsWith("sms:")
        ? "text"
        : "phone") as QuoteContactItem["kind"],
    label: item.label,
    value: item.value,
    href: item.href,
  }));

  return (
    <main>
      <Contact2
        className="pt-36 nav:pt-40"
        eyebrow={pageContent.hero.eyebrow}
        title={pageContent.hero.heading}
        titleAs="h1"
        description={pageContent.hero.body}
        below={<QuoteContacts items={contacts} />}
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
    </main>
  );
}
