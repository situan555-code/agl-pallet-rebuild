import { Suspense } from "react";
import type { Metadata } from "next";
import forms from "@/content/forms.json";
import quotePage from "@/content/pages/request-a-quote.json";
import { Contact2 } from "@/components/contact2";
import { Form, type FormDestination } from "@/components/Form";

export const metadata: Metadata = {
  title: "Carrier Setup - AGL Pallet",
  alternates: { canonical: "/partners/carriers/" },
  robots: { index: false, follow: false },
};

// Form-only page. Sends to the same inbox as the quote form.
export const dynamic = "force-dynamic";

const to =
  quotePage.contactInfo.find((i) => i.href.startsWith("mailto:"))?.href.replace("mailto:", "") || "sales@aglpallet.com";

export default function PartnersCarriers() {
  const destination: FormDestination = { kind: "formsubmit", email: to, subject: forms.carrier.subject };
  return (
    <main>
      <Contact2 className="pt-36 nav:pt-40" eyebrow="Carriers" title="Carrier setup" titleAs="h1">
        <Suspense fallback={null}>
          <Form
            id={forms.carrier.id}
            fields={forms.carrier.fields as never}
            destination={destination}
            submitLabel={forms.carrier.submitLabel}
            successMessage={forms.carrier.successMessage}
            source="/partners/carriers/"
          />
        </Suspense>
      </Contact2>
    </main>
  );
}
