import { Button } from "@/components/Button";
import { insetOuterClass, insetPadClass, insetSurfaceClass } from "@/components/Container";
import { cn } from "@/lib/utils";

export function StaticImageBand({
  eyebrow,
  heading,
  body,
  cta,
  className,
}: {
  eyebrow?: string;
  heading: string;
  body: string;
  image?: { src: string; alt: string };
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section className={cn("section-rhythm scroll-mt-24 bg-moss", insetOuterClass, className)}>
      <div className={cn(insetSurfaceClass, insetPadClass, "bg-green py-16 text-bone nav:py-20")}>
        <div className="max-w-xl">
          {eyebrow && (
            <p className="text-eyebrow font-semibold uppercase tracking-wide text-ice">
              <span aria-hidden="true" className="mr-2 font-bold">
                /
              </span>
              {eyebrow}
            </p>
          )}
          <h2 className="mt-3 text-display-2 text-bone">{heading}</h2>
          <p className="prose-measure mt-5 text-body text-bone/85">{body}</p>
          {cta && (
            <div className="mt-8">
              <Button href={cta.href} label={cta.label} variant="secondary" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
