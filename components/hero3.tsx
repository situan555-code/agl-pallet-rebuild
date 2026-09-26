// Adapted from @shadcnblocks/hero3 (free). Layout kept: two-column grid with
// the headline column and a second column. AGL inner pages carry no imagery
// in content JSON, so the second column holds the lede paragraphs and CTA
// instead of the demo screenshot. Demo reviews/avatars/stars removed.
import Link from "next/link";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Button } from "@/components/Button";

interface Hero3Props {
  eyebrow: string;
  heading: string;
  description?: string | string[];
  cta?: { label: string; href: string };
  /** Visible trail matching BreadcrumbList. Last item is the current page. */
  breadcrumb?: { name: string; href?: string }[];
  className?: string;
}

const Hero3 = ({ eyebrow, heading, description, cta, breadcrumb, className }: Hero3Props) => {
  const paragraphs = description ? (Array.isArray(description) ? description : [description]) : [];
  const hasAside = paragraphs.length > 0 || Boolean(cta);
  return (
    <section className={cn("scroll-mt-24 bg-moss pb-8 pt-28 text-bone nav:pb-10", className)}>
      <div className={cn(containerClass, "rounded-section bg-green py-16 nav:py-20")}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-link text-bone/75">
              {breadcrumb.map((item, i) => (
                <li key={`${item.name}-${i}`} className="contents">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-bone/75">
                      /
                    </span>
                  )}
                  {item.href && i < breadcrumb.length - 1 ? (
                    <Link href={item.href} prefetch={false} className="hover:text-bone hover:underline">
                      {item.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-bone">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      <div
        className={cn(
          "grid gap-8",
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
          <h1 className="display mt-4 max-w-[760px] text-display-1">{heading}</h1>
        </div>
        {hasAside && (
          <div className="border-t border-bone/20 pt-6 nav:col-span-6 nav:border-l nav:border-t-0 nav:pl-10 nav:pt-0">
            <div className="prose-measure space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-body text-bone/85">
                  {p}
                </p>
              ))}
            </div>
            {cta && (
              <div className={cn(paragraphs.length > 0 && "mt-8")}>
                <Button href={cta.href} label={cta.label} variant="secondary" />
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export { Hero3 };
