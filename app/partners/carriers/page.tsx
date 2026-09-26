import { Suspense } from "react";
import { BadgeCheck, MapPin, Repeat, UserRound } from "lucide-react";
import content from "@/content/pages/partners-carriers.json";
import forms from "@/content/forms.json";
import quotePage from "@/content/pages/request-a-quote.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Contact2 } from "@/components/contact2";
import { Form, UNRESOLVED_FORM_NOTICE, type FormDestination } from "@/components/Form";
import { QuoteContacts, type QuoteContactItem } from "@/components/QuoteContacts";
import { isPlaceholder } from "@/lib/placeholders";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Haul for AGL — For Carriers',
  'AGL manages freight on every pallet order we sell. Regional lanes across the Midwest and Mid-Atlantic. Get set up as a carrier.',
  '/partners/carriers/',
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

export default function PartnersCarriers() {
  const openQuestions = content.openQuestions.items.filter((item) => !isPlaceholder(item));
  return (
    <main>
      <Hero3
        eyebrow={content.hero.eyebrow}
        heading={content.hero.heading}
        description={content.hero.body}
        cta={content.hero.cta}
      />

      <Process1
        heading={content.offer.heading}
        steps={content.offer.items.map((item, index) => ({
          title: item.lead,
          description: isPlaceholder(item.body) ? "" : item.body,
          icon: [MapPin, Repeat, UserRound, BadgeCheck][index],
        }))}
      />

      <Contact2
        eyebrow={content.hero.cta.label}
        notes={[UNRESOLVED_FORM_NOTICE]}
        aside={
          <>
            <QuoteContacts items={quoteContacts} className="mt-0 nav:grid-cols-1" />
            {openQuestions.length > 0 ? (
              <div className="rounded-card border border-dashed border-bone/30 p-6">
                <p className="text-eyebrow font-semibold uppercase tracking-wide text-bone/70">
                  {content.openQuestions.heading}
                </p>
                <ul className="mt-3 space-y-1 text-body">
                  {openQuestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        }
      >
        <Suspense fallback={null}>
          <Form
            id={forms.carrier.id}
            fields={forms.carrier.fields as never}
            destination={destination}
            submitLabel={forms.carrier.submitLabel}
            successMessage={forms.carrier.successMessage}
            source="/partners/carriers/"
            hideDestinationNotice
          />
        </Suspense>
      </Contact2>
    </main>
  );
}
