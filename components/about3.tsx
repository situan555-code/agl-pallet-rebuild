// Adapted from @shadcnblocks/about3 (free). Layout kept: the offset
// two-section story grid (first section left on 5/12, second section
// starting at column 8 and dropped lower). Demo gallery, stats (21M/654/…),
// logo marquee, and breakout card removed entirely — SPEC has no stats or
// customer logos and none may be invented. Sections carry content JSON only.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface About3Section {
  label?: string;
  title?: string;
  paragraphs: string[];
  footer?: ReactNode;
}

interface About3Props {
  sections: [About3Section] | [About3Section, About3Section];
  hairline?: boolean;
  className?: string;
}

function StorySection({ section }: { section: About3Section }) {
  return (
    <div className="flex flex-col gap-5">
      {section.label && (
        <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {section.label}
        </p>
      )}
      {section.title && <h2 className="text-display-2 text-brand-green">{section.title}</h2>}
      <div className="prose-measure space-y-4">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="text-body">
            {p}
          </p>
        ))}
      </div>
      {section.footer}
    </div>
  );
}

const About3 = ({ sections, hairline, className }: About3Props) => {
  const [first, second] = sections;
  return (
    <section className={cn("section-y px-6", hairline && "section-hairline", className)}>
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-12">
        <div className="md:col-span-6 nav:col-span-5">
          <StorySection section={first} />
        </div>
        {second && (
          <div className="border-t border-brand-green/15 pt-10 md:col-span-6 md:border-t-0 md:pt-0 nav:col-span-5 nav:col-start-8 nav:mt-28">
            <StorySection section={second} />
          </div>
        )}
      </div>
    </section>
  );
};

export { About3 };
