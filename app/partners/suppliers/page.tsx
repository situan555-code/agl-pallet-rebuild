import { Suspense } from "react";
import { BadgeCheck, Repeat, Settings2, ShieldCheck, Truck } from "lucide-react";
import content from "@/content/pages/partners-suppliers.json";
import forms from "@/content/forms.json";
import quotePage from "@/content/pages/request-a-quote.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Feature1 } from "@/components/feature1";
import { Contact2 } from "@/components/contact2";
import { Form, UNRESOLVED_FORM_NOTICE, type FormDestination } from "@/components/Form";
import { QuoteContacts, type QuoteContactItem } from "@/components/QuoteContacts";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Supply Pallets to AGL — For Mills and Shops',
  'AGL is a pallet brokerage with no plant of its own. Steady recurring volume, paid on time, and no channel conflict. Tell us what your shop builds.',
  '/partners/suppliers/',
);

export const dynamic = "force-dynamic";

const destination: FormDestination = { kind: "unresolved" };

const quoteContacts: QuoteContactItem[] = quotePage.contactInfo.map((item) => ({
  kind: (item.href.startsWith("mailto:")
    ? "email"
    : item.href.startsWith("sms:")
      ? "text"
      : "phone") as QuoteContactItem["kind"],
  label: item.label,
  value: item.value,
  href: item.href,
}));

export default function PartnersSuppliers() {
  return (
    <main>
      <Hero3
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.body}
        cta={content.hero.cta}
      />

      <Process1
        layout="grid"
        heading={content.offer.heading}
        steps={content.offer.items.map((item, index) => ({
          title: item.lead,
          description: item.body,
          icon: [Repeat, BadgeCheck, ShieldCheck, Settings2, Truck][index],
        }))}
      />

      <Feature1 hairline heading={content.ask.heading} paragraphs={content.ask.paragraphs} />

      <Contact2
        eyebrow={content.hero.cta.label}
        notes={[UNRESOLVED_FORM_NOTICE]}
        aside={<QuoteContacts items={quoteContacts} className="mt-0 nav:grid-cols-1" />}
      >
        <Suspense fallback={null}>
          <Form
            id={forms.supplier.id}
            fields={forms.supplier.fields as never}
            destination={destination}
            submitLabel={forms.supplier.submitLabel}
            successMessage={forms.supplier.successMessage}
            source="/partners/suppliers/"
            hideDestinationNotice
          />
        </Suspense>
      </Contact2>
    </main>
  );
}
