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
  description?: string;
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

type ItemHeading = "h2" | "h3";

// Literal class names so Tailwind's scanner sees them.
// divided: md:grid-cols-2 md:grid-cols-3 md:grid-cols-4
const columnClass: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 nav:grid-cols-4",
};

function DividedItem({ item, index, count, Heading }: { item: Feature3Item; index: number; count: number; Heading: ItemHeading }) {
  return (
    <div
      className={cn(
        "py-10 md:py-[72px]",
        index === 0 ? "md:pr-10" : index === count - 1 ? "md:pl-10" : "md:px-10",
        index > 0 && "border-t border-brand-green/20 md:border-l md:border-t-0"
      )}
    >
      <Heading className="text-display-kicker text-current">{item.title}</Heading>
      <p className="mt-4 max-w-sm text-body text-current/80">{item.description}</p>
    </div>
  );
}

// With href, the title becomes the link (editorial list row, no box).
function RuledItem({ item, Heading }: { item: Feature3Item; Heading: ItemHeading }) {
  return (
    <div id={item.id} className="group scroll-mt-24 border-t border-brand-green/15 pb-4 pt-8">
      {item.eyebrow && (
        <p className="mb-3 text-eyebrow font-semibold uppercase tracking-wide text-current/70">{item.eyebrow}</p>
      )}
      <Heading className="text-display-row text-current">
        {item.href ? (
          <Link
            href={item.href}
            prefetch={false}
            className="inline-flex items-baseline gap-3 rounded-input underline-offset-[6px] hover:underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
          >
            {item.title}
            <ArrowIcon className="h-5 w-5 shrink-0 translate-y-0.5 transition-transform duration-200 motion-safe:group-hover:translate-x-1" />
          </Link>
        ) : (
          item.title
        )}
      </Heading>
      {item.description && <p className="prose-measure mt-4 text-body text-current/80">{item.description}</p>}
      {item.cta && (
        <div className="mt-6">
          <Button href={item.cta.href} label={item.cta.label} variant="secondary" />
        </div>
      )}
    </div>
  );
}

function NumberedItem({ item, Heading }: { item: Feature3Item; Heading: ItemHeading }) {
  return (
    <article className="h-full rounded-card bg-green p-10 text-bone">
      {item.eyebrow && (
        <p className="font-display text-display-numeral text-ice">{item.eyebrow}</p>
      )}
      <Heading className={cn("text-step-lg text-bone", item.eyebrow && "mt-6")}>{item.title}</Heading>
      <p className="mt-3 text-body text-bone/85">{item.description}</p>
    </article>
  );
}

function CardItem({ item, Heading }: { item: Feature3Item; Heading: ItemHeading }) {
  const inner = (
    <>
      {item.eyebrow && (
        <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">{item.eyebrow}</p>
      )}
      <Heading className={cn("text-step-lg leading-snug text-pretty text-current", item.eyebrow && "mt-3")}>{item.title}</Heading>
      {item.description && <p className="mt-3 text-body text-bone/85">{item.description}</p>}
      {item.cta && (
        <div className="mt-auto pt-6">
          <Button href={item.cta.href} label={item.cta.label} variant="secondary" />
        </div>
      )}
      {item.href && (
        <span className="mt-auto flex justify-end pt-6">
          <ArrowIcon className="h-6 w-6 text-ice transition-transform duration-200 motion-safe:group-hover:translate-x-2" />
        </span>
      )}
    </>
  );
  const cardClass =
    "hover-lift group flex h-full min-h-full flex-col gap-0 rounded-card border border-smoke bg-green p-8 text-bone nav:p-10";
  if (item.href && !item.href.startsWith("/")) {
    return (
      <a
        href={item.href}
        className={cn(cardClass, "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green")}
      >
        {inner}
      </a>
    );
  }
  return item.href ? (
    <Link
      href={item.href}
      prefetch={false}
      className={cn(cardClass, "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green")}
    >
      {inner}
    </Link>
  ) : (
    <div className={cardClass}>{inner}</div>
  );
}

const Feature3 = ({ eyebrow, heading, features, variant, columns = 3, hairline, className }: Feature3Props) => {
  // Item titles step down from the section heading; without one they sit
  // directly under the page h1.
  const Heading: ItemHeading = heading ? "h3" : "h2";
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
            <p className="mb-8 text-eyebrow font-semibold uppercase tracking-wide text-current/70">
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
            variant === "divided"
              ? `md:grid-cols-${columns}`
              :             variant === "card" && columns === 3
                ? "nav:grid-cols-3"
                : columnClass[columns],
            variant === "card" && "items-stretch",
            gap
          )}
        >
          {features.map((item, index) => {
            if (variant === "divided")
              return <DividedItem key={item.title} item={item} index={index} count={features.length} Heading={Heading} />;
            if (variant === "ruled") return <RuledItem key={item.title} item={item} Heading={Heading} />;
            if (variant === "numbered") return <NumberedItem key={item.title} item={item} Heading={Heading} />;
            return <CardItem key={item.title} item={item} Heading={Heading} />;
          })}
        </div>
      </div>
    </section>
  );
};

export { Feature3 };
