import { BadgeCheck, Repeat, Settings2, ShieldCheck, Truck } from "lucide-react";
import content from "@/content/pages/partners-suppliers.json";
import quotePage from "@/content/pages/request-a-quote.json";
import { Hero3 } from "@/components/hero3";
import { Process1 } from "@/components/process1";
import { Feature1 } from "@/components/feature1";
import { Contact2 } from "@/components/contact2";
import { QuoteContacts, type QuoteContactItem } from "@/components/QuoteContacts";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

const SUPPLIER_OFFER_PHOTOS = [
  "/assets/stock/agl-filler-pallet-stack-05_3e39.webp",
  "/assets/stock/agl-filler-pallet-stack-06_bb58.webp",
  "/assets/stock/agl-filler-pallet-stack-07_179a.webp",
  "/assets/stock/agl-industry-building-materials-02_188a.webp",
  "/assets/stock/agl-shipping-3pl-02_8474.webp",
] as const;

export const metadata: Metadata = pageMeta(
  "Sell Pallets to a Broker That Won't Compete With You | AGL",
  "AGL is a pallet brokerage. Steady recurring volume, paid on time, and no channel conflict. Tell us what your shop builds.",
  "/partners/suppliers/",
);

const reach: QuoteContactItem[] = quotePage.contactInfo
  .filter((item) => !item.href.startsWith("sms:"))
  .map((item) => ({
    kind: (item.href.startsWith("mailto:") ? "email" : "phone") as QuoteContactItem["kind"],
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
          image: SUPPLIER_OFFER_PHOTOS[index],
          icon: [Repeat, BadgeCheck, ShieldCheck, Settings2, Truck][index],
          href: item.lead.includes("freight") ? "/partners/carriers/" : item.lead.includes("conflict") ? "/the-pledge/" : "#contact",
        }))}
      />

      <Feature1 hairline heading={content.ask.heading} paragraphs={content.ask.paragraphs} />

      <Contact2 id="contact" eyebrow={content.hero.cta.label}>
        <QuoteContacts items={reach} className="mt-0 nav:grid-cols-2" />
      </Contact2>
    </main>
  );
}
