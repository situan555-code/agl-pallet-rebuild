import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Button } from "@/components/Button";

interface Feature2Props {
  id?: string;
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  cta?: { label: string; href: string };
  hairline?: boolean;
  className?: string;
  contained?: boolean;
}

const Feature2 = ({ id, eyebrow, heading, paragraphs, cta, hairline, className, contained }: Feature2Props) => {
  return (
    <section id={id} className={cn("section-y scroll-mt-24", !contained && "px-6", hairline && "section-hairline", className)}>
      <div className={cn("grid items-start gap-10 nav:grid-cols-12 nav:gap-16", contained ? containerClass : "mx-auto max-w-[1440px]")}>
        <div className="nav:col-span-5">
          {eyebrow && (
            <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
          )}
          <h2 className="mt-4 text-display-1 text-bone">{heading}</h2>
        </div>
        <div className="flex flex-col justify-center nav:col-span-6 nav:col-start-7">
          <div className="prose-measure space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-body">
                {p}
              </p>
            ))}
          </div>
          {cta && (
            <div className="mt-8">
              <Button href={cta.href} label={cta.label} variant="secondary" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Feature2 };
