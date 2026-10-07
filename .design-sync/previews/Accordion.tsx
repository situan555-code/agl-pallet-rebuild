import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Plus } from "agl-pallet";

// Mobile menu pattern from HeaderSheet: single, collapsible, nav groups.
export const MobileNavGroups = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-md">
      <Accordion type="single" collapsible defaultValue="/products/">
        <AccordionItem value="/products/" className="border-current/15">
          <AccordionTrigger className="items-center py-4 text-[15px] font-semibold text-current hover:no-underline">
            Products
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid gap-1">
              {["Stock Pallets", "Custom & Engineered", "Crates", "Dunnage", "Shipping Blocks", "Stakes"].map((label) => (
                <li key={label} className="block rounded-input p-3 text-sm font-medium text-current hover:bg-current/8">
                  {label}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="/partners/" className="border-current/15">
          <AccordionTrigger className="items-center py-4 text-[15px] font-semibold text-current hover:no-underline">
            Partners
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid gap-1">
              <li className="block rounded-input p-3 text-sm font-medium">For Mills & Shops</li>
              <li className="block rounded-input p-3 text-sm font-medium">For Carriers</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="/resources/" className="border-current/15">
          <AccordionTrigger className="items-center py-4 text-[15px] font-semibold text-current hover:no-underline">
            Resources
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid gap-1">
              <li className="block rounded-input p-3 text-sm font-medium">Pallet Sizes</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
);

// FAQ pattern from Faq3: multiple, all open, plus icon.
const faqs = [
  {
    id: "faq-1",
    q: "Do I need a two-way or four-way pallet?",
    a: "A two-way pallet takes a forklift or pallet jack from two opposite sides. A four-way takes entry from all four. Which one you need depends on how your dock, racking, and material-handling equipment move the load.",
  },
  {
    id: "faq-2",
    q: "Minimums",
    a: "No minimums. One truckload or forty. Order size does not decide whether we pick up the phone.",
  },
];

export const FaqOnLight = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <div className="max-w-2xl">
      <Accordion type="multiple" defaultValue={faqs.map((f) => f.id)} className="border-t border-brand-green/15">
        {faqs.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="border-b border-brand-green/15">
            <AccordionTrigger className="group/faq items-center gap-6 rounded-none py-6 text-left hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden!">
              <span className="text-step-lg font-semibold text-current">{f.q}</span>
              <Plus aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 text-current transition-transform duration-200 group-data-[state=open]/faq:rotate-45" />
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="prose-measure text-body text-current/80">{f.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);
