// Adapted from @shadcnblocks/hero1 + full-bleed pattern from free service2.
// Layered photographic hero: local next/image fill, AGL-green gradient
// vignette (not black SaaS overlay), clay accent rule, and a parchment
// capability strip that overlaps the next section for depth.
// Demo defaults / CDN / social-proof avatars removed. Spec-safe copy only.
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { getBlurDataURL } from "@/lib/blur";

type Hero1Button = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

type Capability = {
  heading: string;
  body: string;
};

interface Hero1Props {
  eyebrow: string;
  heading: string;
  description: string;
  buttons: Hero1Button[];
  image: { src: string; alt: string };
  /** Optional secondary photo for layered depth (absolute inset panel). */
  secondaryImage?: { src: string; alt: string };
  capabilities?: Capability[];
  className?: string;
}

const Hero1 = ({
  eyebrow,
  heading,
  description,
  buttons,
  image,
  secondaryImage,
  capabilities,
  className,
}: Hero1Props) => {
  const blurDataURL = getBlurDataURL(image.src);
  const secondaryBlur = secondaryImage ? getBlurDataURL(secondaryImage.src) : undefined;

  return (
    <section className={cn("relative scroll-mt-0 text-cream", className)}>
      {/* Full-bleed photographic ground */}
      <div className="relative isolate min-h-svh overflow-hidden bg-brand-green">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          quality={78}
          sizes="100vw"
          className="object-cover object-center"
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
        />
        {/* Sophisticated Natural vignette — AGL green, not black carnival */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-brand-green/95 via-brand-green/78 to-brand-green/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-brand-green via-brand-green/20 to-brand-green/55"
        />
        {/* Clay edge hairline at bottom of photo field */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-clay/40" />

        <div className="relative z-10 mx-auto flex min-h-svh max-w-[1440px] flex-col justify-end px-6 pb-28 pt-36 nav:pb-36 nav:pt-40">
          <div className="grid items-end gap-10 nav:grid-cols-12 nav:gap-12">
            <div className="nav:col-span-7">
              <p className="text-eyebrow font-semibold uppercase tracking-wide text-fog-green">
                <span aria-hidden="true" className="mr-2 font-bold text-clay">
                  /
                </span>
                {eyebrow}
              </p>
              <span aria-hidden="true" className="mt-5 block h-0.5 w-14 bg-clay" />
              <h1 className="display mt-6 max-w-[18ch] wrap-break-word text-display-1 text-bone nav:text-[56px] nav:leading-[1.08]">
                {heading}
              </h1>
              <p className="prose-measure mt-6 text-body text-cream/85">{description}</p>
              <div className="mt-10 flex flex-col items-start gap-4 min-[560px]:flex-row min-[560px]:flex-wrap">
                {buttons.map((button) => (
                  <Button key={button.label} href={button.href} label={button.label} variant={button.variant} />
                ))}
              </div>
            </div>

            {secondaryImage && (
              <div className="relative hidden nav:col-span-5 nav:block">
                <div className="relative ml-auto aspect-4/5 w-full max-w-[380px] overflow-hidden rounded-sm ring-1 ring-clay/35">
                  <Image
                    src={secondaryImage.src}
                    alt={secondaryImage.alt}
                    fill
                    quality={70}
                    sizes="380px"
                    className="object-cover"
                    placeholder={secondaryBlur ? "blur" : undefined}
                    blurDataURL={secondaryBlur}
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-brand-green/15" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlapping parchment capability band — kills empty mid-page void */}
      {capabilities && capabilities.length > 0 && (
        <div className="relative z-20 -mt-16 px-6 nav:-mt-20">
          <div className="mx-auto grid max-w-[1440px] gap-px overflow-hidden rounded-sm bg-clay/40 shadow-[0_24px_60px_-28px_rgba(31,42,31,0.45)] md:grid-cols-3">
            {capabilities.map((cap) => (
              <article key={cap.heading} className="bg-paper px-8 py-10 nav:px-10 nav:py-12">
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

export { Hero1 };
