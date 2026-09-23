// Adapted from @shadcnblocks/hero3 (free). Layout kept: two-column grid with
// the headline column and a second column. AGL inner pages carry no imagery
// in content JSON, so the second column holds the lede paragraphs and CTA
// instead of the demo screenshot. Demo reviews/avatars/stars removed.
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";

interface Hero3Props {
  eyebrow: string;
  heading: string;
  description?: string | string[];
  cta?: { label: string; href: string };
  className?: string;
}

const Hero3 = ({ eyebrow, heading, description, cta, className }: Hero3Props) => {
  const paragraphs = description ? (Array.isArray(description) ? description : [description]) : [];
  const hasAside = paragraphs.length > 0 || Boolean(cta);
  return (
    <section className={cn("scroll-mt-24 bg-brand-green px-6 pb-16 pt-36 text-white nav:pb-20", className)}>
      <div
        className={cn(
          "mx-auto grid max-w-[1440px] gap-8",
          hasAside && "nav:grid-cols-12 nav:items-end nav:gap-16"
        )}
      >
        <div className={cn(hasAside && "nav:col-span-6")}>
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-[760px] text-display-1">{heading}</h1>
        </div>
        {hasAside && (
          <div className="border-t border-white/20 pt-6 nav:col-span-6 nav:border-l nav:border-t-0 nav:pl-10 nav:pt-0">
            <div className="prose-measure space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-body text-white/85">
                  {p}
                </p>
              ))}
            </div>
            {cta && (
              <div className={cn(paragraphs.length > 0 && "mt-8")}>
                <Button href={cta.href} label={cta.label} variant="pill-light" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export { Hero3 };
