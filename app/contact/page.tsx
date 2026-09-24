import type { Metadata } from "next";
import { Suspense } from "react";
import content from "@/content/pages/contact.json";
import forms from "@/content/forms.json";
import { Hero3 } from "@/components/hero3";
import { RuleList } from "@/components/RuleList";
import { Contact2 } from "@/components/contact2";
import { Form, type FormDestination } from "@/components/Form";

export const metadata: Metadata = {
  title: "Contact AGL Pallet — North Canton, Ohio",
  description:
    "Request a quote, supply pallets to AGL, get set up as a carrier, or ask a question. 234-286-0402.",
  alternates: { canonical: "/contact/" },
};

export const dynamic = "force-dynamic";

export default function Contact() {
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "sales@aglpallet.com";
  const destination: FormDestination = {
    kind: "formsubmit",
    email: to,
    subject: forms.general.subject,
    autoresponse: forms.general.autoresponse,
  };

  return (
    <main>
      <Hero3 eyebrow={content.hero.eyebrow} heading={content.hero.heading} description={content.hero.lede} />

      {/* Section J1 (owner): four full-width ruled rows with green hover — kept over a card grid. */}
      <section className="section-y">
        <RuleList
          layout="contact"
          items={content.cards.map((c) => ({
            title: c.lead,
            body: c.body,
            href: c.href,
          }))}
        />
      </section>

      <Contact2
        id="general-form"
        eyebrow="Something else"
        notes={[content.hero.phoneBody]}
      >
        <Suspense fallback={null}>
          <Form
            id={forms.general.id}
            fields={forms.general.fields as never}
            destination={destination}
            submitLabel={forms.general.submitLabel}
            successMessage={forms.general.successMessage}
            source="/contact/"
          />
        </Suspense>
      </Contact2>
    </main>
  );
}
