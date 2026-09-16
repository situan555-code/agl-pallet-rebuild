import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export type RuleListItem = {
  title: string;
  body: string;
  href?: string;
};

function stripScaffolding(text: string) {
  return text.replace(/\s*(?:\u2192|->)\s+\S+\s*$/g, "").trim();
}

function RowInner({
  item,
  layout,
}: {
  item: RuleListItem;
  layout: "contact" | "industries";
}) {
  const body = stripScaffolding(item.body);
  const titleClass =
    "font-display text-display-row uppercase text-brand-green transition-colors group-hover:text-white group-focus-within:text-white";
  const bodyClass =
    "text-body text-ink/55 transition-colors group-hover:text-white group-focus-within:text-white";

  if (layout === "industries") {
    return (
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-8 md:flex-row md:items-baseline md:justify-between md:gap-16 md:py-10">
        <h2 className={`${titleClass} md:max-w-[40%]`}>{item.title}</h2>
        <p className={`${bodyClass} md:w-[55%]`}>{body}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-8 md:py-10">
      <div className="min-w-0">
        <h2 className={titleClass}>{item.title}</h2>
        <p className={`mt-1 ${bodyClass}`}>{body}</p>
      </div>
      <ArrowIcon className="h-6 w-6 shrink-0 text-brand-green transition-transform duration-200 group-hover:text-white group-focus-within:text-white motion-safe:group-hover:translate-x-2 motion-safe:group-focus-within:translate-x-2" />
    </div>
  );
}

const rowClass =
  "peer group w-full border-t border-brand-green/15 transition-colors first:border-t-0 hover:border-transparent hover:bg-brand-green focus-within:border-transparent focus-within:bg-brand-green peer-hover:border-transparent peer-focus-within:border-transparent";

export function RuleList({
  items,
  layout,
}: {
  items: RuleListItem[];
  layout: "contact" | "industries";
}) {
  return (
    <ul>
      {items.map((item) => {
        const inner = <RowInner item={item} layout={layout} />;
        return (
          <li key={item.title} className={rowClass}>
            {item.href ? (
              <Link
                href={item.href}
                prefetch={false}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
              >
                {inner}
              </Link>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
