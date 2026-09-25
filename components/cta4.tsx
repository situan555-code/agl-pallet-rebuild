// Adapted from @shadcnblocks/cta4 (free). Layout kept: heading + description
// + primary button on one side, a supporting column on the other. Demo copy
// and the checklist ("24/7 Support" etc.) removed; the checklist renders only
// if content supplies items. Runs full-bleed on brand green as the page's
// closing CTA instead of the demo's muted rounded panel.
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";

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
    <section className={cn("section-y-cta bg-brand-green px-6 text-white", className)}>
      <div className="mx-auto grid max-w-[1440px] items-end gap-8 nav:grid-cols-12 nav:gap-16">
        <div className="nav:col-span-7">
          {eyebrow && (
            <p className="mb-4 text-eyebrow font-semibold uppercase tracking-wide">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
          )}
          <h2 className="text-display-2 text-white">{heading}</h2>
        </div>
        <div className="border-t border-white/20 pt-6 nav:col-span-5 nav:border-l nav:border-t-0 nav:pl-10 nav:pt-0">
          <p className="prose-measure text-body text-white/85">{description}</p>
          {features && features.length > 0 && (
            <ul className="mt-6 space-y-2 text-body">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span aria-hidden="true" className="block h-px w-4 bg-white/60" />
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
    </section>
  );
};

export { Cta4 };
