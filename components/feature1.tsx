// Adapted from @shadcnblocks/feature1 (free). Layout kept: copy column left,
// media column right on a two-column grid. Demo defaultProps and CDN image
// removed. When no media is passed, the right column carries the body copy
// (heading left, prose right), which is how AGL uses it for text-only
// sections. Everything renders on paper; no box around the copy.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";

interface Feature1Props {
  id?: string;
  eyebrow?: string;
  heading: string;
  paragraphs?: string[];
  cta?: { label: string; href: string };
  media?: ReactNode;
  hairline?: boolean;
  className?: string;
}

function Body({ paragraphs, cta }: Pick<Feature1Props, "paragraphs" | "cta">) {
  return (
    <>
      {paragraphs && paragraphs.length > 0 && (
        <div className="prose-measure space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-body">
              {p}
            </p>
          ))}
        </div>
      )}
      {cta && (
        <div className="mt-8">
          <Button href={cta.href} label={cta.label} variant="secondary" />
        </div>
      )}
    </>
  );
}

const Feature1 = ({ id, eyebrow, heading, paragraphs, cta, media, hairline, className }: Feature1Props) => {
  return (
    <section id={id} className={cn("section-y scroll-mt-24 overflow-hidden", hairline && "section-hairline", className)}>
      <div className={cn(containerClass, "grid items-start gap-10 nav:grid-cols-12 nav:gap-16")}>
        {media ? (
          <>
            <div className="nav:col-span-6">
              <SectionHeading eyebrow={eyebrow} heading={heading} />
              <div className="mt-5">
                <Body paragraphs={paragraphs} cta={cta} />
              </div>
            </div>
            <div className="nav:col-span-5 nav:col-start-8">{media}</div>
          </>
        ) : (
          <>
            <div className="nav:col-span-5">
              <SectionHeading eyebrow={eyebrow} heading={heading} />
            </div>
            <div className="nav:col-span-6 nav:col-start-7 nav:pt-10">
              <Body paragraphs={paragraphs} cta={cta} />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export { Feature1 };
