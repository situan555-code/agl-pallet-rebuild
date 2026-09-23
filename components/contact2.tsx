// Adapted from @shadcnblocks/contact2 (free). Layout kept: intro + contact
// methods in the left column, the form in the right column. The demo's
// react-hook-form/zod form (which only console.logs) is replaced by a
// children slot so pages pass the working components/Form.tsx (FormSubmit /
// unresolved-destination handling). Demo copy, web link, and green-500
// success styling removed; runs on brand green because Form.tsx is styled
// for a dark ground.
import type { ReactNode } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Contact2Method {
  kind: "phone" | "email" | "text";
  label: string;
  value: string;
  href: string;
}

interface Contact2Props {
  id?: string;
  eyebrow: string;
  title?: string;
  titleAs?: "h1" | "h2";
  description?: string;
  methods?: Contact2Method[];
  notes?: string[];
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

const icons = { phone: Phone, email: Mail, text: MessageSquare };

const Contact2 = ({
  id,
  eyebrow,
  title,
  titleAs = "h2",
  description,
  methods,
  notes,
  aside,
  children,
  className,
}: Contact2Props) => {
  const Title = titleAs;
  return (
    <section id={id} className={cn("section-y scroll-mt-24 bg-brand-green px-6 text-white", className)}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 nav:flex-row nav:gap-24">
        <div className="flex flex-col gap-10 nav:w-5/12">
          <div className="flex flex-col gap-4">
            <p className="text-eyebrow font-semibold uppercase tracking-wide">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
            {title && (
              <Title className={titleAs === "h1" ? "text-display-1" : "text-display-2"}>{title}</Title>
            )}
            {description && <p className="prose-measure text-body text-white/85">{description}</p>}
          </div>
          {methods && methods.length > 0 && (
            <ul className="flex flex-col border-t border-white/20">
              {methods.map((method) => {
                const Icon = icons[method.kind];
                return (
                  <li key={method.label} className="border-b border-white/20">
                    <a
                      href={method.href}
                      className="group flex items-center gap-4 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-white/70" />
                      <span className="flex flex-col">
                        <span className="text-eyebrow font-semibold uppercase tracking-wide text-white/70">
                          {method.label}
                        </span>
                        <span className="text-step-sm font-semibold group-hover:underline">{method.value}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {notes && notes.length > 0 && (
            <div className="space-y-2">
              {notes.map((note) => (
                <p key={note} className="text-body text-white/85">
                  {note}
                </p>
              ))}
            </div>
          )}
          {aside}
        </div>
        <div className="min-w-0 nav:flex-1 [&>form]:mt-0">{children}</div>
      </div>
    </section>
  );
};

export { Contact2 };
