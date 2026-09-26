// Adapted from @shadcnblocks/process1 (free). Layout kept: sticky intro
// column on the left, ruled step rows on the right, each row with a marker
// chip, title, and description. Demo steps, lorem ipsum, orange asterisk,
// and red corner illustration removed. Numbers render only when content
// supplies them (SPEC numerals); otherwise the chip is a plain green mark.
// Body text is rendered as stored. A screen-reader-only " — " sits between
// the title and the body so the spec line stays one sentence. It is not
// shown as a visible leading dash.
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { IconTile } from "@/components/IconTile";
import { SectionHeading } from "@/components/SectionHeading";

export interface Process1Step {
  number?: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface Process1Props {
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  steps: Process1Step[];
  /** grid: card tiles (supplier offer). team: monogram avatars. */
  layout?: "stack" | "grid" | "team";
  hairline?: boolean;
  className?: string;
}

function specJoin() {
  return <span className="sr-only"> — </span>;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const Process1 = ({ id, eyebrow, heading, description, steps, layout = "stack", hairline, className }: Process1Props) => {
  const hasIntro = Boolean(heading || description);
  const ItemHeading = heading ? "h3" : "h2";
  return (
    <section id={id} className={cn("section-y scroll-mt-24", hairline && "section-hairline", className)}>
      <div className={cn(containerClass, "grid grid-cols-1 gap-10", hasIntro && "nav:grid-cols-12 nav:gap-16")}>
        {hasIntro && (
          <div className="h-fit nav:sticky nav:top-28 nav:col-span-4">
            {heading && <SectionHeading eyebrow={eyebrow} heading={heading} />}
            {description && <p className="prose-measure mt-5 text-body">{description}</p>}
          </div>
        )}
        {layout === "team" ? (
          <ul className={cn("grid gap-8 sm:grid-cols-2", hasIntro && "nav:col-span-8")}>
            {steps.map((step) => (
              <li key={step.title} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green text-[15px] font-semibold text-bone"
                >
                  {initials(step.title)}
                </span>
                <div className="min-w-0">
                  <ItemHeading className="text-body font-semibold text-bone">{step.title}</ItemHeading>
                  {step.description.trim() !== "" && (
                    <>
                      {specJoin()}
                      <p className="mt-1 text-body text-gray">{step.description}</p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : layout === "grid" ? (
          <ul className={cn("grid gap-4 md:grid-cols-2", hasIntro && "nav:col-span-8")}>
            {steps.map((step) => (
              <li key={step.title} className="rounded-card bg-green p-8 text-bone">
                {step.icon ? <IconTile icon={step.icon} /> : null}
                <ItemHeading className={cn("text-step-lg text-current", step.icon && "mt-5")}>{step.title}</ItemHeading>
                {step.description.trim() !== "" && (
                  <>
                    {specJoin()}
                    <p className="prose-measure mt-5 text-body text-gray">{step.description}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ol className={cn("w-full", hasIntro && "nav:col-span-8")}>
            {steps.map((step) => (
              <li
                key={step.title}
                className="flex flex-col gap-5 border-t border-brand-green/15 py-6 last:border-b md:flex-row md:items-start md:gap-8"
              >
                {step.icon ? (
                  <IconTile icon={step.icon} />
                ) : step.number ? (
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-gray/20 bg-smoke text-[13px] font-semibold text-ice"
                  >
                    {step.number}
                  </span>
                ) : null}
                <div className="min-w-0">
                  <ItemHeading className="text-step-lg text-current">{step.title}</ItemHeading>
                  {step.description.trim() !== "" && (
                    <>
                      {specJoin()}
                      <p className="prose-measure mt-5 text-body text-current/80">{step.description}</p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};

export { Process1 };
