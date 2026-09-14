import { Suspense } from "react";
import content from "@/content/pages/partners-suppliers.json";
import forms from "@/content/forms.json";
import { PageHero } from "@/components/PageHero";
import { ListBlock } from "@/components/ListBlock";
import { ProseBlock } from "@/components/ProseBlock";
import { Form, type FormDestination } from "@/components/Form";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Supply Pallets to AGL — For Mills and Shops',
  'AGL is a pallet brokerage with no plant of its own. Steady recurring volume, paid on time, and no channel conflict. Tell us what your shop builds.',
  '/partners/suppliers/',
);

export const dynamic = "force-dynamic";

const destination: FormDestination = { kind: "unresolved", token: forms.supplier.destinationToken };

export default function PartnersSuppliers() {
  return (
    <main>
      <PageHero
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        body={content.hero.body}
        cta={content.hero.cta}
      />

      <section className="section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <ListBlock heading={content.offer.heading} items={content.offer.items} />
        </div>
      </section>

      <section className="section-y px-6 bg-surface-alt">
        <div className="mx-auto max-w-[1440px]">
          <ProseBlock heading={content.ask.heading} paragraphs={content.ask.paragraphs} />
        </div>
      </section>

      <section className="section-y bg-brand-green px-6 text-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">/</span>
            {content.hero.cta.label}
          </p>
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
        </div>
      </section>
    </main>
  );
}
