import Image from "next/image";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Button } from "@/components/Button";
import { LazyHeroVideo } from "@/components/LazyHeroVideo";

type HeroButton = {
  label: string;
  href: string;
};

export function HeroExpand({
  eyebrow,
  heading,
  description,
  buttons,
  video,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  buttons: HeroButton[];
  video: { src: string; poster: string };
}) {
  const [primary, ...rest] = buttons;

  return (
    <div data-hero-track className="hero-track relative">
      <div className={cn(containerClass, "pt-20 pb-3 md:pt-28 md:pb-6 nav:pt-32")}>
        <p className="mx-auto text-center text-eyebrow font-semibold uppercase tracking-wide">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
        <h1 className="display mx-auto mt-3 max-w-3xl text-center text-display-1 text-current nav:text-[56px] nav:leading-[1.08]">
          {heading}
        </h1>
        <p className="prose-measure mx-auto mt-4 max-w-[46rem] text-pretty text-center text-body text-current/80 md:mt-5">
          {description}
        </p>
        <div className="mt-5 flex flex-col items-center gap-2.5 md:mt-8 md:gap-3">
          {primary ? <Button href={primary.href} label={primary.label} variant="primary" /> : null}
          {rest.length > 0 ? (
            <div className="flex flex-col items-center gap-2.5 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:justify-center md:gap-3">
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
          ) : null}
        </div>
      </div>

      <div className="hero-frame-slot mx-auto w-full max-w-[1280px] px-6 pb-10 md:w-[min(92vw,1440px)] md:max-w-[1440px] md:px-0 md:pb-12">
        <div className="hero-frame relative mx-auto w-full overflow-hidden shadow-lg aspect-video rounded-section">
          <Image
            src={video.poster}
            alt=""
            fill
            priority
            fetchPriority="high"
            quality={60}
            sizes="(max-width: 767px) calc(100vw - 48px), min(92vw, 1440px)"
            className="object-cover object-center"
          />
          <LazyHeroVideo src={video.src} />
        </div>
      </div>
      <div aria-hidden="true" className="hero-spacer" />
    </div>
  );
}
