import changelog from "@/content/resources/changelog.json";
import { formatDate } from "@/lib/resources";

type Entry = { date: string; change: string };

const ENTRIES = changelog as Record<string, Entry[]>;

/** Date plus one line, at the foot of a guide. */
export function Changelog({ slug }: { slug: string }) {
  const items = ENTRIES[slug];
  if (!items || items.length === 0) return null;
  return (
    <section id="changelog" aria-labelledby="changelog-h" className="scroll-mt-28 border-t border-brand-green/15 pt-10">
      <h2 id="changelog-h" className="text-display-row text-brand-green">
        Changelog
      </h2>
      <ul className="prose-measure mt-6 space-y-3 text-body text-ink/85">
        {items.map((item) => (
          <li key={`${item.date}-${item.change}`}>
            <time dateTime={item.date} className="font-semibold text-ink">
              {formatDate(item.date)}
            </time>
            {" — "}
            {item.change}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function hasChangelog(slug: string) {
  return Boolean(ENTRIES[slug]?.length);
}
