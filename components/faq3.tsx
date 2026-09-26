"use client";

// Adapted from @shadcnblocks/faq3 (free). Layout kept: centered intro over a
// single-column accordion. Demo questions/answers and the support panel
// removed. Every item starts open (type="multiple") so answers are readable
// and indexable without a click; buyers can still collapse them. Styled with
// TW3-compatible classes because components/ui/accordion ships TW4 variants.
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface Faq3Item {
  id: string;
  question: string;
  answer: string;
}

interface Faq3Props {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: Faq3Item[];
  className?: string;
}

const Faq3 = ({ eyebrow, heading, description, items, className }: Faq3Props) => {
  return (
    <section className={cn("section-y scroll-mt-24", className)}>
      <div className={cn(containerClass, "grid gap-10 nav:grid-cols-12 nav:gap-16")}>
        <div className="nav:col-span-4">
          <Reveal>
            <SectionHeading eyebrow={eyebrow} heading={heading} />
            {description && <p className="prose-measure mt-6 text-body">{description}</p>}
          </Reveal>
        </div>
        <Accordion
          type="multiple"
          defaultValue={items.map((item) => item.id)}
          className="border-t border-brand-green/15 nav:col-span-8"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-b border-brand-green/15">
              <AccordionTrigger className="group/faq items-center gap-6 rounded-none py-6 text-left hover:no-underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green **:data-[slot=accordion-trigger-icon]:hidden!">
                <span className="text-step-lg font-semibold text-current">{item.question}</span>
                <Plus
                  aria-hidden="true"
                  className="ml-auto h-5 w-5 shrink-0 text-current transition-transform duration-200 group-data-[state=open]/faq:rotate-45"
                />
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="prose-measure text-body text-current/80">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { Faq3 };
