import { Form } from "agl-pallet";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date" | "number" | "file";
  required?: boolean;
  options?: string[];
  helpText?: string;
  disableSubmission?: boolean;
};

const quoteFields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "company", label: "Company", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "spec", label: "Pallet size or spec", type: "text", required: true },
  { name: "quantity", label: "Quantity and frequency", type: "text", required: true },
  { name: "shipTo", label: "Ship-to city and state", type: "text", required: true },
  { name: "targetDate", label: "Target date", type: "date", required: false },
  { name: "notes", label: "Notes", type: "textarea", required: false },
];

const generalFields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "company", label: "Company", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "message", label: "Message", type: "textarea", required: true },
];

const supplierFields: Field[] = [
  { name: "shopName", label: "Shop name", type: "text", required: true },
  { name: "cityState", label: "City and state", type: "text", required: true },
  { name: "contactName", label: "Contact name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "equipmentFit", label: "What your equipment runs well", type: "textarea", required: true },
  { name: "weeklyCapacity", label: "Approximate weekly capacity", type: "text", required: false },
  { name: "specsBuilt", label: "Specs you build", type: "textarea", required: false },
  { name: "leadTime", label: "Typical lead time", type: "text", required: false },
  { name: "heatTreat", label: "Heat treat on site", type: "select", required: false, options: ["Yes", "No", "Not sure"] },
];

export const QuoteRequest = () => (
  <div className="bg-moss p-8 text-bone">
    <Form
      id="quote-form"
      fields={quoteFields}
      destination={{
        kind: "formsubmit",
        email: "sales@aglpallet.com",
        subject: "AGL Pallet website quote request",
        autoresponse: "Thanks for reaching out to AGL Pallet. We received your spec and will come back to you the same day.",
      }}
      submitLabel="Send the spec"
      successMessage="Got it. We'll come back to you the same day."
      source="/request-a-quote/"
    />
  </div>
);

export const GeneralMessage = () => (
  <div className="bg-moss p-8 text-bone">
    <Form
      id="general-form"
      fields={generalFields}
      destination={{ kind: "formsubmit", email: "sales@aglpallet.com", subject: "AGL Pallet website message" }}
      submitLabel="Send"
      successMessage="Thanks — we'll get back to you."
      source="/contact/"
    />
  </div>
);

export const UnresolvedDestination = () => (
  <div className="bg-moss p-8 text-bone">
    <Form
      id="supplier-form"
      fields={supplierFields}
      destination={{ kind: "unresolved" }}
      submitLabel="Send it over"
      successMessage="Thanks. Supplier relations will follow up."
      source="/partners/suppliers/"
    />
  </div>
);
