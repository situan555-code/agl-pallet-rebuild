import { CopyValue, Phone, Mail, MessageSquare } from "agl-pallet";

const methods = [
  { icon: Phone, label: "Phone Number", value: "234-286-0402", href: "tel:2342860402" },
  { icon: Mail, label: "Email Address", value: "sales@aglpallet.com", href: "mailto:sales@aglpallet.com" },
  { icon: MessageSquare, label: "Text", value: "234-286-0402", href: "sms:2342860402" },
];

export const ContactMethods = () => (
  <div className="bg-moss p-8 text-bone">
    <ul className="flex max-w-md flex-col border-t border-current/15">
      {methods.map(({ icon: Icon, ...m }) => (
        <li key={m.label} className="border-b border-current/15">
          <div className="flex items-center gap-4 py-5">
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-current/70" />
            <CopyValue value={m.value} href={m.href} label={m.label} />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export const Single = () => (
  <div className="bg-moss p-8 text-bone">
    <CopyValue label="Email Address" value="sales@aglpallet.com" href="mailto:sales@aglpallet.com" />
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <CopyValue label="Phone Number" value="234-286-0402" href="tel:2342860402" />
  </div>
);
