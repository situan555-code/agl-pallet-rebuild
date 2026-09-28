// Adapted from @shadcnblocks/hero3 (free). Layout kept: two-column grid with
// the headline column and a second column. Demo reviews/avatars/stars removed.
// Fills inherit the page field. No inset color slabs.
import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Button } from "@/components/Button";

export type Hero3Variant = "inset-dark" | "light-text" | "light-image";

interface Hero3Props {
  eyebrow: string;
  heading: string;
  description?: string | string[];
  cta?: { label: string; href: string };
  /** Visible trail matching BreadcrumbList. Last item is the current page. */
  breadcrumb?: { name: string; href?: string }[];
  variant?: Hero3Variant;
  image?: ReactNode;
  className?: string;
}

const Hero3 = ({
  eyebrow,
  heading,
  description,
  cta,
  breadcrumb,
  variant = "inset-dark",
  image,
  className,
}: Hero3Props) => {
  const paragraphs = description ? (Array.isArray(description) ? description : [description]) : [];
  const displayHeading = variant === "inset-dark";
  const hasImage = variant === "light-image" && Boolean(image);
  const hasAside = !hasImage && (paragraphs.length > 0 || Boolean(cta));
  return (
    <section className={cn("scroll-mt-24 pt-28", className)}>
      <div className={cn(containerClass, "py-16 nav:py-20")}>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-link text-current/70">
              {breadcrumb.map((item, i) => (
                <li key={`${item.name}-${i}`} className="contents">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-current/50">
                      /
                    </span>
                  )}
                  {item.href && i < breadcrumb.length - 1 ? (
                    <Link href={item.href} prefetch={false} className="hover:underline hover:text-current">
                      {item.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-current">
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
            hasAside && "nav:grid-cols-12 nav:items-end nav:gap-16",
            hasImage && "nav:grid-cols-12 nav:items-center nav:gap-16"
          )}
        >
          <div className={cn((hasAside || hasImage) && "nav:col-span-6")}>
            <p className="text-eyebrow font-semibold uppercase tracking-wide">
              <span aria-hidden="true" className="mr-2 font-bold text-ice">
                /
              </span>
              {eyebrow}
            </p>
            <h1 className={cn("mt-3 max-w-[760px] text-display-1", displayHeading && "display")}>{heading}</h1>
            {hasImage && paragraphs.length > 0 && (
              <div className="prose-measure mt-6 space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-body text-current/85">
                    {p}
                  </p>
                ))}
              </div>
            )}
            {hasImage && cta && (
              <div className="mt-8">
                <Button href={cta.href} label={cta.label} variant="primary" />
              </div>
            )}
          </div>
          {hasImage && <div className="nav:col-span-5 nav:col-start-8">{image}</div>}
          {hasAside && (
            <div className="border-t border-current/15 pt-6 nav:col-span-6 nav:border-l nav:border-t-0 nav:pl-10 nav:pt-0">
              <div className="prose-measure space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-body text-current/85">
                    {p}
                  </p>
                ))}
              </div>
              {cta && (
                <div className={cn(paragraphs.length > 0 && "mt-8")}>
                  <Button href={cta.href} label={cta.label} variant={displayHeading ? "secondary" : "primary"} />
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
