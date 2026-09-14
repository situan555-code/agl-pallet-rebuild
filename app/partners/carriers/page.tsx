import { Suspense } from "react";
import content from "@/content/pages/partners-carriers.json";
import forms from "@/content/forms.json";
import { PageHero } from "@/components/PageHero";
import { ListBlock } from "@/components/ListBlock";
import { Form, type FormDestination } from "@/components/Form";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Haul for AGL — For Carriers',
  'AGL manages freight on every pallet order we sell. Regional lanes across the Midwest and Mid-Atlantic. Get set up as a carrier.',
  '/partners/carriers/',
);

export const dynamic = "force-dynamic";

const destination: FormDestination = { kind: "unresolved", token: forms.carrier.destinationToken };

export default function PartnersCarriers() {
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

      <section className="mx-auto max-w-[1440px] px-6">
        <div className="prose-measure rounded-input border border-dashed border-brand-green/30 bg-surface-alt p-6">
          <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
            {content.openQuestions.heading}
          </p>
          <ul className="mt-3 space-y-1 text-body text-ink">
            {content.openQuestions.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
              id={forms.carrier.id}
              fields={forms.carrier.fields as never}
              destination={destination}
              submitLabel={forms.carrier.submitLabel}
              successMessage={forms.carrier.successMessage}
              source="/partners/carriers/"
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
