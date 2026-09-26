// Adapted from @shadcnblocks/process1 (free). Layout kept: sticky intro
// column on the left, ruled step rows on the right, each row with a marker
// chip, title, and description. Demo steps, lorem ipsum, orange asterisk,
// and red corner illustration removed. Numbers render only when content
// supplies them (SPEC numerals); otherwise the chip is a plain green mark.
// Descriptions keep the SPEC "Lead — body" reading order in innerText.
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export interface Process1Step {
  number?: string;
  title: string;
  description: string;
}

interface Process1Props {
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  steps: Process1Step[];
  hairline?: boolean;
  className?: string;
}

function withLeadDash(text: string) {
  return /^\s*[—–-]/.test(text) ? text : `— ${text}`;
}

const Process1 = ({ id, eyebrow, heading, description, steps, hairline, className }: Process1Props) => {
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
        <ol className={cn("w-full", hasIntro && "nav:col-span-8")}>
          {steps.map((step) => (
            <li
              key={step.title}
              className="flex flex-col gap-5 border-t border-brand-green/15 py-8 last:border-b md:flex-row md:gap-10 md:py-12 nav:py-14"
            >
              <div
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-input bg-ice font-display text-[14px] uppercase leading-none text-moss"
              >
                {step.number ?? <span className="block h-2 w-2 bg-brand-green" />}
              </div>
              <div className="min-w-0">
                <ItemHeading className="text-step-lg text-current">{step.title}</ItemHeading>
                {step.description.trim() !== "" && (
                  <p className="prose-measure mt-3 text-body text-current/80">{withLeadDash(step.description)}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export { Process1 };
