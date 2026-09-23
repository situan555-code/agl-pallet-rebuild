// Adapted from free @shadcnblocks/hero115. Centered copy + concentric clay
// rings + framed local photo. Demo SaaS dashboard / Wifi / fake KPI byline
// removed. Driven by content/pages/home.json (SPEC_V1 verbatim). Palette 03.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button as UiButton } from "@/components/ui/button";
import { getBlurDataURL } from "@/lib/blur";

type Hero115Button = {
  label: string;
  href: string;
  variant?: "pill-light" | "ghost-light" | "pill-dark" | "ghost-dark";
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
  image: { src: string; alt: string };
  capabilities?: Capability[];
  className?: string;
}

const Hero115 = ({
  eyebrow,
  heading,
  description,
  buttons,
  image,
  capabilities,
  className,
}: Hero115Props) => {
  const blurDataURL = getBlurDataURL(image.src);
  const [primary, ...rest] = buttons;

  return (
    <section className={cn("overflow-hidden bg-paper text-ink", className)}>
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
              <Boxes className="size-6 md:size-7" aria-hidden="true" />
            </span>

            <p className="mx-auto text-center text-eyebrow font-semibold uppercase tracking-wide text-ink/70">
              <span aria-hidden="true" className="mr-2 font-bold text-clay">
                /
              </span>
              {eyebrow}
            </p>

            <h1 className="mx-auto max-w-3xl text-center text-display-1 text-brand-green nav:text-[56px] nav:leading-[1.08]">
              {heading}
            </h1>

            <p className="prose-measure mx-auto max-w-3xl text-center text-body text-ink/80 md:text-lg">
              {description}
            </p>

            <div className="flex flex-col items-center gap-3 pb-10 pt-3">
              {primary && (
                <UiButton
                  size="lg"
                  asChild
                  className="h-11 w-full rounded-full bg-brand-green px-6 text-button font-bold text-cream hover:bg-ink sm:w-auto"
                >
                  <Link href={primary.href} prefetch={false}>
                    {primary.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </UiButton>
              )}
              {rest.length > 0 && (
                <div className="flex flex-col items-center gap-3 pt-1 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:justify-center">
                  {rest.map((button) => (
                    <Link
                      key={button.label}
                      href={button.href}
                      prefetch={false}
                      className="rounded-full border border-brand-green/40 px-5 py-2.5 text-nav-link font-semibold text-brand-green transition-colors hover:bg-brand-green/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                    >
                      {button.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative mx-auto aspect-[3/4] h-full max-h-[524px] w-full max-w-5xl overflow-hidden rounded-lg border border-clay/60 shadow-[0_24px_60px_-28px_rgba(31,42,31,0.35)] md:aspect-video">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              quality={78}
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover object-center"
              placeholder={blurDataURL ? "blur" : undefined}
              blurDataURL={blurDataURL}
            />
          </div>
        </div>
      </div>

      {capabilities && capabilities.length > 0 && (
        <div className="relative z-20 -mt-8 px-6 pb-6 nav:-mt-12">
          <div className="mx-auto grid max-w-[1440px] gap-px overflow-hidden rounded-sm bg-clay/40 shadow-[0_24px_60px_-28px_rgba(31,42,31,0.45)] md:grid-cols-3">
            {capabilities.map((cap) => (
              <article key={cap.heading} className="bg-cream px-8 py-10 nav:px-10 nav:py-12">
                <h2 className="text-display-kicker text-brand-green">{cap.heading}</h2>
                <span aria-hidden="true" className="mt-4 block h-px w-8 bg-clay" />
                <p className="mt-4 max-w-sm text-body text-ink/75">{cap.body}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export { Hero115 };
