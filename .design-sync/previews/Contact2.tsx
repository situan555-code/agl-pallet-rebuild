import { Contact2, Form, QuoteContacts } from "agl-pallet";

const contactItems = [
  { kind: "phone" as const, label: "Phone Number", value: "234-286-0402", href: "tel:2342860402" },
  { kind: "email" as const, label: "Email Address", value: "sales@aglpallet.com", href: "mailto:sales@aglpallet.com" },
  { kind: "text" as const, label: "Text", value: "234-286-0402", href: "sms:2342860402" },
];

const quoteFields = [
  { name: "name", label: "Name", type: "text" as const, required: true },
  { name: "company", label: "Company", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "email" as const, required: true },
  { name: "phone", label: "Phone", type: "tel" as const, required: false },
  { name: "spec", label: "Pallet size or spec", type: "text" as const, required: true },
  { name: "quantity", label: "Quantity and frequency", type: "text" as const, required: true },
  { name: "shipTo", label: "Ship-to city and state", type: "text" as const, required: true },
  { name: "targetDate", label: "Target date", type: "date" as const, required: false },
  { name: "notes", label: "Notes", type: "textarea" as const, required: false },
];

const generalFields = [
  { name: "name", label: "Name", type: "text" as const, required: true },
  { name: "company", label: "Company", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "email" as const, required: true },
  { name: "phone", label: "Phone", type: "tel" as const, required: false },
  { name: "message", label: "Message", type: "textarea" as const, required: true },
];

const carrierFields = [
  { name: "carrierName", label: "Carrier name", type: "text" as const, required: true },
  { name: "mcNumber", label: "MC number", type: "text" as const, required: true },
  { name: "dotNumber", label: "DOT number", type: "text" as const, required: true },
  { name: "contactName", label: "Contact name", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "email" as const, required: true },
  { name: "phone", label: "Phone", type: "tel" as const, required: true },
  { name: "equipmentType", label: "Equipment type", type: "select" as const, required: true, options: ["Dry van", "Flatbed", "Both", "Other"] },
  { name: "lanes", label: "Lanes you run", type: "textarea" as const, required: true },
  { name: "truckCount", label: "Number of trucks", type: "number" as const, required: false },
];

export const RequestAQuote = () => (
  <div className="bg-moss text-bone">
    <Contact2
      eyebrow="Request a quote"
      title="Send us a spec and a quantity."
      titleAs="h1"
      description="We'll come back the same day. No minimums, and more than one qualified source behind whatever you're buying."
      below={<QuoteContacts items={contactItems} />}
    >
      <Form
        id="quote-form"
        fields={quoteFields}
        destination={{ kind: "formsubmit", email: "sales@aglpallet.com", subject: "AGL Pallet website quote request" }}
        submitLabel="Send the spec"
        successMessage="Got it. We'll come back to you the same day."
        source="/request-a-quote/"
      />
    </Contact2>
  </div>
);

export const CarrierWithAside = () => (
  <div className="bg-moss text-bone">
    <Contact2
      eyebrow="Get set up as a carrier"
      notes={["This form is not sending yet. The destination address is not confirmed, so nothing is transmitted. Call 234-286-0402 in the meantime."]}
      aside={<QuoteContacts items={contactItems} className="mt-0 nav:grid-cols-1" />}
    >
      <Form
        id="carrier-form"
        fields={carrierFields}
        destination={{ kind: "unresolved" }}
        submitLabel="Get set up"
        successMessage="Thanks. Our dispatcher will be in touch."
        source="/partners/carriers/"
        hideDestinationNotice
      />
    </Contact2>
  </div>
);

export const MethodsAndNotes = () => (
  <div className="bg-moss text-bone">
    <Contact2
      id="general-form"
      eyebrow="Something else"
      title="An existing order, a spec question, or anything else."
      methods={contactItems}
      notes={["Or just call. 234-286-0402 — North Canton, Ohio."]}
    >
      <Form
        id="general-form"
        fields={generalFields}
        destination={{ kind: "formsubmit", email: "sales@aglpallet.com", subject: "AGL Pallet website message" }}
        submitLabel="Send"
        successMessage="Thanks — we'll get back to you."
        source="/contact/"
      />
    </Contact2>
  </div>
);
