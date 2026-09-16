import type { Metadata } from "next";
import { Suspense } from "react";
import content from "@/content/pages/contact.json";
import forms from "@/content/forms.json";
import { RuleList } from "@/components/RuleList";
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
      <section className="scroll-mt-24 bg-brand-green px-6 pb-16 pt-36 text-center text-white">
        <div className="mx-auto max-w-[800px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {content.hero.eyebrow}
          </p>
          <h1 className="mt-4 text-display-1">{content.hero.heading}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-body">{content.hero.lede}</p>
        </div>
      </section>

      <section className="section-y">
        <RuleList
          layout="contact"
          items={content.cards.map((c) => ({
            title: c.lead,
            body: c.body,
            href: c.href,
          }))}
        />
        <div className="mx-auto mt-12 max-w-[1440px] px-6">
          <p className="text-center text-body">{content.hero.phoneBody}</p>
          <p className="mt-2 text-center text-body">{"{{TBD-ADDRESS}}"}</p>
        </div>
      </section>

      <section id="general-form" className="scroll-mt-24 section-y bg-brand-green px-6 text-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            Something else
          </p>
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
        </div>
      </section>
    </main>
  );
}
