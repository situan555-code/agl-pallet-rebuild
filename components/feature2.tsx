// Adapted from @shadcnblocks/feature2 (free). Layout kept: media column left,
// copy column right. The media slot is used as the page's single mint
// pull-quote panel (PROJECT.md allows one pull-quote tint), carrying the
// eyebrow and heading; body paragraphs and CTA sit on paper to the right.
// Demo defaultProps and CDN image removed.
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";

interface Feature2Props {
  id?: string;
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  cta?: { label: string; href: string };
  hairline?: boolean;
  className?: string;
}

const Feature2 = ({ id, eyebrow, heading, paragraphs, cta, hairline, className }: Feature2Props) => {
  return (
    <section id={id} className={cn("section-y scroll-mt-24 px-6", hairline && "section-hairline", className)}>
      <div className="mx-auto grid max-w-[1440px] items-stretch gap-10 nav:grid-cols-12 nav:gap-16">
        <div className="flex flex-col justify-between gap-10 rounded-sm border-l-[3px] border-brand-green bg-mint p-8 nav:col-span-5 nav:p-12">
          {eyebrow && (
            <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
          )}
          <h2 className="text-display-2 text-brand-green">{heading}</h2>
        </div>
        <div className="flex flex-col justify-center nav:col-span-6 nav:col-start-7">
          <div className="prose-measure space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-body">
                {p}
              </p>
            ))}
          </div>
          {cta && (
            <div className="mt-8">
              <Button href={cta.href} label={cta.label} variant="ghost-dark" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Feature2 };
