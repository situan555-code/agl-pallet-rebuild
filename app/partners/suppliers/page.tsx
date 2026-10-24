import { Suspense } from "react";
import type { Metadata } from "next";
import forms from "@/content/forms.json";
import quotePage from "@/content/pages/request-a-quote.json";
import { Contact2 } from "@/components/contact2";
import { Form, type FormDestination } from "@/components/Form";

export const metadata: Metadata = {
  title: "Supplier Inquiry - AGL Pallet",
  alternates: { canonical: "/partners/suppliers/" },
  robots: { index: false, follow: false },
};

// Form-only page. Sends to the same inbox as the quote form.
export const dynamic = "force-dynamic";

const to =
  quotePage.contactInfo.find((i) => i.href.startsWith("mailto:"))?.href.replace("mailto:", "") || "sales@aglpallet.com";

export default function PartnersSuppliers() {
  const destination: FormDestination = { kind: "formsubmit", email: to, subject: forms.supplier.subject };
  return (
    <main>
      <Contact2 className="pt-36 nav:pt-40" eyebrow="Suppliers" title="Supplier inquiry" titleAs="h1">
        <Suspense fallback={null}>
          <Form
            id={forms.supplier.id}
            fields={forms.supplier.fields as never}
            destination={destination}
            submitLabel={forms.supplier.submitLabel}
            successMessage={forms.supplier.successMessage}
            source="/partners/suppliers/"
          />
        </Suspense>
      </Contact2>
    </main>
  );
}
