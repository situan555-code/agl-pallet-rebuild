// Closing CTA band. Uses Section inset-green + grain (R1.4).
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

interface Cta4Props {
  eyebrow?: string;
  heading: string;
  description: string;
  button: { label: string; href: string };
  features?: string[];
  className?: string;
}

const Cta4 = ({ eyebrow, heading, description, button, features, className }: Cta4Props) => {
  return (
    <Section variant="inset-green" grain className={className}>
      <div className={cn("mx-auto grid max-w-[1440px] items-end gap-8 nav:grid-cols-12 nav:gap-16")}>
        <div className="nav:col-span-7">
          {eyebrow && (
            <p className="mb-4 text-eyebrow font-semibold uppercase tracking-wide">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
          )}
          <h2 className="text-display-2 text-bone">{heading}</h2>
        </div>
        <div className="border-t border-bone/20 pt-6 nav:col-span-5 nav:border-l nav:border-t-0 nav:pl-10 nav:pt-0">
          <p className="prose-measure text-body text-bone/85">{description}</p>
          {features && features.length > 0 && (
            <ul className="mt-6 space-y-2 text-body">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span aria-hidden="true" className="block h-px w-4 bg-bone/60" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8">
            <Button href={button.href} label={button.label} variant="secondary" />
          </div>
        </div>
      </div>
    </Section>
  );
};

export { Cta4 };
