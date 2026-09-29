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
  heading,
  description,
  buttons,
  video,
}: {
  heading: string;
  description: string;
  buttons: HeroButton[];
  video: { src: string; poster: string };
}) {
  const [primary, ...rest] = buttons;

  return (
    <>
      <div data-hero-track className="hero-track relative text-current">
        <div className="hero-stage">
          <div className={cn(containerClass, "hero-copy")}>
            <h1 className="display mx-auto max-w-4xl text-center text-display-1 text-current nav:text-[56px] nav:leading-[1.08]">
              {heading}
            </h1>
          </div>

          <div className="hero-frame-slot">
            <div className="hero-frame relative overflow-hidden shadow-lg">
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

          <div className={cn(containerClass, "hero-actions")}>
            {primary ? <Button href={primary.href} label={primary.label} variant="primary" /> : null}
            {rest.length > 0 ? (
              <div className="flex flex-col items-center gap-2.5 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:justify-center">
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
        <div aria-hidden="true" className="hero-spacer" />
      </div>
      <div className={cn(containerClass, "hero-lede")}>
        <p className="prose-measure mx-auto text-pretty text-center text-body text-current/80">{description}</p>
      </div>
    </>
  );
}
