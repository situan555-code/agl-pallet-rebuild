// Adapted from @shadcnblocks/feature3 (free). Layout kept: optional section
// heading over a responsive item grid. Demo defaultProps (SaaS features,
// icons, CDN art) removed. The demo boxes every item in a Card; AGL only
// boxes discrete clickable choices (PROJECT.md), so the grid has four
// treatments:
//   divided  — single row, vertical hairlines between columns (claims)
//   ruled    — top hairline per item, multi-row (categories)
//   numbered — 3px green top rule, display numeral (proof points)
//   card     — bordered card, only for items that link somewhere
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { ArrowIcon } from "@/components/icons";

export interface Feature3Item {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
  href?: string;
  cta?: { label: string; href: string };
}

interface Feature3Props {
  eyebrow?: string;
  heading?: string;
  features: Feature3Item[];
  variant: "divided" | "ruled" | "numbered" | "card";
  columns?: 2 | 3 | 4;
  hairline?: boolean;
  className?: string;
}

// Literal class names so Tailwind's scanner sees them.
// divided: md:grid-cols-2 md:grid-cols-3 md:grid-cols-4
const columnClass: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 nav:grid-cols-4",
};

function DividedItem({ item, index, count }: { item: Feature3Item; index: number; count: number }) {
  return (
    <div
      className={cn(
        "py-10 md:py-[72px]",
        index === 0 ? "md:pr-10" : index === count - 1 ? "md:pl-10" : "md:px-10",
        index > 0 && "border-t border-brand-green/20 md:border-l md:border-t-0"
      )}
    >
      <h3 className="text-display-kicker text-brand-green">{item.title}</h3>
      <span aria-hidden="true" className="mt-4 block h-px w-8 bg-brand-green/40" />
      <p className="mt-4 max-w-sm text-body text-ink/70">{item.description}</p>
    </div>
  );
}

function RuledItem({ item }: { item: Feature3Item }) {
  return (
    <div id={item.id} className="scroll-mt-24 border-t border-brand-green/15 pb-4 pt-8">
      <h3 className="text-display-row text-brand-green">{item.title}</h3>
      <p className="prose-measure mt-4 text-body text-ink/70">{item.description}</p>
      {item.cta && (
        <div className="mt-6">
          <Button href={item.cta.href} label={item.cta.label} variant="ghost-dark" />
        </div>
      )}
    </div>
  );
}

function NumberedItem({ item }: { item: Feature3Item }) {
  return (
    <article className="h-full rounded-sm border-t-[3px] border-brand-green bg-white p-10">
      {item.eyebrow && (
        <p className="font-display text-display-numeral uppercase text-brand-green">{item.eyebrow}</p>
      )}
      <h3 className={cn("text-step-lg text-brand-green", item.eyebrow && "mt-6")}>{item.title}</h3>
      <p className="mt-3 text-body text-ink/70">{item.description}</p>
    </article>
  );
}

function CardItem({ item }: { item: Feature3Item }) {
  const inner = (
    <>
      {item.eyebrow && (
        <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">{item.eyebrow}</p>
      )}
      <h3 className={cn("text-step-lg text-brand-green", item.eyebrow && "mt-3")}>{item.title}</h3>
      <p className="mt-3 text-body text-ink">{item.description}</p>
      {item.cta && (
        <div className="mt-auto pt-6">
          <Button href={item.cta.href} label={item.cta.label} variant="ghost-dark" />
        </div>
      )}
      {item.href && (
        <ArrowIcon className="mt-auto h-6 w-6 self-end text-brand-green transition-transform duration-200 motion-safe:group-hover:translate-x-2" />
      )}
    </>
  );
  const cardClass =
    "group flex h-full flex-col gap-0 rounded-sm border border-brand-green/15 bg-white p-8 transition-colors hover:border-brand-green nav:p-10";
  return item.href ? (
    <Link
      href={item.href}
      prefetch={false}
      className={cn(cardClass, "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green")}
    >
      {inner}
    </Link>
  ) : (
    <div className={cardClass}>{inner}</div>
  );
}

const Feature3 = ({ eyebrow, heading, features, variant, columns = 3, hairline, className }: Feature3Props) => {
  const gap =
    variant === "divided" ? "" : variant === "ruled" ? "gap-x-16 gap-y-10" : "gap-8";
  return (
    <section className={cn(variant === "divided" ? "px-6" : "section-y px-6", hairline && "section-hairline", className)}>
      <div className="mx-auto max-w-[1440px]">
        {heading ? (
          <div className="mb-10 nav:mb-14">
            <SectionHeading eyebrow={eyebrow} heading={heading} />
          </div>
        ) : (
          eyebrow && (
            <p className="mb-8 text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
          )
        )}
        <div
          className={cn(
            "grid grid-cols-1",
            variant === "divided" ? `md:grid-cols-${columns}` : columnClass[columns],
            gap
          )}
        >
          {features.map((item, index) => {
            if (variant === "divided")
              return <DividedItem key={item.title} item={item} index={index} count={features.length} />;
            if (variant === "ruled") return <RuledItem key={item.title} item={item} />;
            if (variant === "numbered") return <NumberedItem key={item.title} item={item} />;
            return <CardItem key={item.title} item={item} />;
          })}
        </div>
      </div>
    </section>
  );
};

export { Feature3 };
