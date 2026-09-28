// Adapted from @shadcnblocks/contact2 (free). Layout kept: intro + contact
// methods in the left column, the form in the right column. The demo's
// react-hook-form/zod form (which only console.logs) is replaced by a
// children slot so pages pass the working components/Form.tsx (FormSubmit /
// unresolved-destination handling). Demo copy, web link, and green-500
// success styling removed. Form fields inherit the page field.
import type { ReactNode } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { CopyValue } from "@/components/CopyValue";

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
  below?: ReactNode;
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
  below,
  children,
  className,
}: Contact2Props) => {
  const Title = titleAs;
  return (
    <section id={id} className={cn("section-y scroll-mt-24", className)}>
      <div className={containerClass}>
      <div className="flex flex-col gap-12 nav:flex-row nav:gap-16">
        <div className="flex flex-col gap-10 nav:sticky nav:top-28 nav:w-5/12 nav:self-start">
          <div className="flex flex-col">
            <p className="text-eyebrow font-semibold uppercase tracking-wide">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
            {title && (
              <Title className={cn("mt-3", titleAs === "h1" ? "text-display-1" : "text-display-2")}>{title}</Title>
            )}
            {description && <p className="prose-measure mt-5 text-body text-current/85">{description}</p>}
          </div>
          {methods && methods.length > 0 && (
            <ul className="flex flex-col border-t border-current/15">
              {methods.map((method) => {
                const Icon = icons[method.kind];
                return (
                  <li key={method.label} className="border-b border-current/15">
                    <div className="flex items-center gap-4 py-5">
                      <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-current/70" />
                      <CopyValue value={method.value} href={method.href} label={method.label} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {notes && notes.length > 0 && (
            <div className="space-y-2">
              {notes.map((note) => (
                <p key={note} className="text-body text-current/85">
                  {note}
                </p>
              ))}
            </div>
          )}
          {aside}
        </div>
        <div className="min-w-0 nav:flex-1 [&>form]:mt-0">{children}</div>
      </div>
      {below}
      </div>
    </section>
  );
};

export { Contact2 };
