import { QuoteContacts } from "agl-pallet";

const items = [
  { kind: "phone" as const, label: "Phone Number", value: "234-286-0402", href: "tel:2342860402" },
  { kind: "email" as const, label: "Email Address", value: "sales@aglpallet.com", href: "mailto:sales@aglpallet.com" },
  { kind: "text" as const, label: "Text", value: "234-286-0402", href: "sms:2342860402" },
];

export const ThreeUp = () => (
  <div className="bg-moss p-8 text-bone">
    <QuoteContacts items={items} className="mt-0 nav:grid-cols-3" />
  </div>
);

export const StackedAside = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm">
      <QuoteContacts items={items} className="mt-0 nav:grid-cols-1" />
    </div>
  </div>
);
