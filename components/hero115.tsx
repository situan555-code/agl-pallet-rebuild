// Adapted from free @shadcnblocks/hero115. Centered copy + concentric clay
// rings + framed local photo. Demo SaaS dashboard / Wifi / fake KPI byline
// removed. Driven by content/pages/home.json (SPEC_V1 verbatim). Palette 03.
import { cn } from "@/lib/utils";
import { BoxesIcon } from "@/components/inline-icons";
import { Button } from "@/components/Button";
import { HeroVideo } from "@/components/HeroVideo";

type Hero115Button = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type Capability = {
  heading: string;
  body: string;
};

interface Hero115Props {
  eyebrow: string;
  heading: string;
  description: string;
  buttons: Hero115Button[];
  video: { src: string; poster: string };
  capabilities?: Capability[];
  className?: string;
}

const Hero115 = ({
  eyebrow,
  heading,
  description,
  buttons,
  video,
  capabilities,
  className,
}: Hero115Props) => {
  const [primary, ...rest] = buttons;

  return (
    <section className={cn("overflow-hidden bg-moss text-bone", className)}>
      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-28 nav:pb-20 nav:pt-32">
        <div className="flex flex-col gap-5">
          <div className="relative isolate flex flex-col gap-5">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 mx-auto size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-clay/50 p-16 mask-[linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] [-webkit-mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border border-clay/40 p-16 md:p-32">
                <div className="size-full rounded-full border border-clay/30" />
              </div>
            </div>

            <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-clay bg-cream text-brand-green md:size-20">
              <BoxesIcon className="size-6 md:size-7" />
            </span>

            <p className="mx-auto text-center text-eyebrow font-semibold uppercase tracking-wide text-ice">
              <span aria-hidden="true" className="mr-2 font-bold text-clay">
                /
              </span>
              {eyebrow}
            </p>

            <h1 className="display mx-auto max-w-3xl text-center text-display-1 text-bone nav:text-[56px] nav:leading-[1.08]">
              {heading}
            </h1>

            <p className="prose-measure mx-auto max-w-3xl text-center text-body text-bone/80 md:text-lg">
              {description}
            </p>

            <div className="flex flex-col items-center gap-3 pb-10 pt-3">
              {primary && (
                <Button href={primary.href} label={primary.label} variant="primary" />
              )}
              {rest.length > 0 && (
                <div className="flex flex-col items-center gap-3 pt-1 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:justify-center">
                  {rest.map((button) => (
                    <Button
                      key={button.label}
                      href={button.href}
                      label={button.label}
                      variant="secondary"
                      arrow={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative mx-auto aspect-3/4 h-full max-h-[524px] w-full max-w-5xl overflow-hidden rounded-card border border-smoke shadow-lg md:aspect-video">
            <HeroVideo src={video.src} poster={video.poster} />
          </div>
        </div>
      </div>

      {capabilities && capabilities.length > 0 && (
        <div className="relative z-20 -mt-8 px-6 pb-6 nav:-mt-12">
          <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-3">
            {capabilities.map((cap) => (
              <article key={cap.heading} className="hover-lift rounded-card bg-green px-8 py-10 text-bone nav:px-10 nav:py-12">
                <h2 className="text-display-kicker text-bone">{cap.heading}</h2>
                <span aria-hidden="true" className="mt-4 block h-px w-8 bg-ice/50" />
                <p className="mt-4 max-w-sm text-body text-bone/75">{cap.body}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export { Hero115 };
