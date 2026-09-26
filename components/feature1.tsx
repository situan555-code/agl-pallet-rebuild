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
  /** Image column side on wide screens. Consecutive text-and-image sections alternate. */
  mediaSide?: "left" | "right";
  /** Bone copy on a rounded inset panel. The page ground stays moss. */
  panel?: boolean;
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

const Feature1 = ({
  id,
  eyebrow,
  heading,
  paragraphs,
  cta,
  media,
  mediaSide = "right",
  panel = false,
  hairline,
  className,
}: Feature1Props) => {
  const mediaLeft = mediaSide === "left";
  const grid = (
    <div
      className={cn(
        "grid gap-10 nav:grid-cols-12 nav:gap-16",
        media ? "items-center" : "items-start",
        !panel && containerClass
      )}
    >
      {media ? (
        <>
          <div className={cn("nav:col-span-6", mediaLeft && "nav:col-start-7")}>
            <SectionHeading eyebrow={eyebrow} heading={heading} />
            <div className="mt-5">
              <Body paragraphs={paragraphs} cta={cta} />
            </div>
          </div>
          <div
            className={cn(
              "nav:col-span-5",
              mediaLeft ? "nav:col-start-1 nav:row-start-1" : "nav:col-start-8"
            )}
          >
            {media}
          </div>
        </>
      ) : (
        <>
          <div className="nav:col-span-5">
            <SectionHeading eyebrow={eyebrow} heading={heading} />
          </div>
          <div className="nav:col-span-6 nav:col-start-7">
            <Body paragraphs={paragraphs} cta={cta} />
          </div>
        </>
      )}
    </div>
  );

  if (panel) {
    return (
      <section id={id} className={cn("section-y scroll-mt-24 bg-moss", hairline && "section-hairline", className)}>
        <div className={cn(containerClass, "surface-light rounded-section bg-bone py-16 text-moss nav:py-20")}>
          {grid}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={cn("section-y scroll-mt-24 overflow-hidden", hairline && "section-hairline", className)}>
      {grid}
    </section>
  );
};

export { Feature1 };
