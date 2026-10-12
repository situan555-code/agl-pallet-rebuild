import { BadgeCheck, MapPin, Repeat, UserRound } from "lucide-react";
import content from "@/content/pages/partners-carriers.json";
import quotePage from "@/content/pages/request-a-quote.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Contact2 } from "@/components/contact2";
import { QuoteContacts, type QuoteContactItem } from "@/components/QuoteContacts";
import { isPlaceholder } from "@/lib/placeholders";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

const CARRIER_OFFER_PHOTOS = [
  "/assets/stock/agl-shipping-3pl-03_4801.webp",
  "/assets/stock/agl-filler-pallet-stack-08_b566.webp",
  "/assets/stock/agl-industry-refinery-01_dc7e.webp",
  "/assets/stock/agl-industry-food-beverage-03_ec8c.webp",
] as const;

export const metadata: Metadata = pageMeta(
  "Regional Dry Van and Flatbed Loads, Mill to Plant | AGL",
  "AGL manages freight on every pallet order we sell. Regional lanes across the Midwest and Mid-Atlantic. Get set up as a carrier.",
  "/partners/carriers/",
);

const reach: QuoteContactItem[] = quotePage.contactInfo
  .filter((item) => !item.href.startsWith("sms:"))
  .map((item) => ({
    kind: (item.href.startsWith("mailto:") ? "email" : "phone") as QuoteContactItem["kind"],
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
          image: CARRIER_OFFER_PHOTOS[index],
          icon: [MapPin, Repeat, UserRound, BadgeCheck][index],
          href: item.lead.includes("dispatcher") ? "/who-we-are/" : "#contact",
        }))}
      />

      <Contact2
        id="contact"
        eyebrow={content.hero.cta.label}
        aside={
          openQuestions.length > 0 ? (
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
          ) : null
        }
      >
        <QuoteContacts items={reach} className="mt-0 nav:grid-cols-2" />
      </Contact2>
    </main>
  );
}
