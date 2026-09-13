import type { Metadata } from "next";
import { Suspense } from "react";
import pageContent from "@/content/pages/request-a-quote.json";
import { ContactForm } from "@/components/ContactForm";
import { ContactInfoStrip } from "@/components/ContactInfoStrip";

export const metadata: Metadata = {
  title: "Request a Quote - AGL Pallet",
  openGraph: {
    type: "article",
    images: ["/assets/agl_social_share.jpg"],
  },
};

export const dynamic = "force-dynamic";

export default function RequestAQuote() {
  // Public sales inbox on the live site; CONTACT_TO_EMAIL overrides when set at runtime.
  const to =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    pageContent.contactInfo.find((i) => i.href.startsWith("mailto:"))?.href.replace("mailto:", "") ||
    "sales@aglpallet.com";

  return (
    <main>
      <section className="bg-brand-green px-6 pb-16 pt-[144px] text-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {pageContent.hero.eyebrow}
          </p>
          <h1 className="mt-4 text-display-1">{pageContent.hero.heading}</h1>
          <p className="mt-6 max-w-2xl text-body">{pageContent.hero.body}</p>
          <Suspense fallback={null}>
            <ContactForm to={to} />
          </Suspense>
        </div>
      </section>

      <ContactInfoStrip items={pageContent.contactInfo} />
    </main>
  );
}
