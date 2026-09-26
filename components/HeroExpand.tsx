import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Button } from "@/components/Button";
import { HeroVideo } from "@/components/HeroVideo";

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
    <div data-hero-track className="hero-track relative bg-moss text-bone">
      <div className={cn(containerClass, "pt-28 pb-6 nav:pt-32")}>
        <p className="mx-auto text-center text-eyebrow font-semibold uppercase tracking-wide text-ice">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
        <h1 className="display mx-auto mt-3 max-w-3xl text-center text-display-1 text-bone nav:text-[56px] nav:leading-[1.08]">
          {heading}
        </h1>
        <p className="prose-measure mx-auto mt-5 max-w-3xl text-center text-body text-bone/80">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          {primary ? <Button href={primary.href} label={primary.label} variant="primary" /> : null}
          {rest.length > 0 ? (
            <div className="flex flex-col items-center gap-3 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:justify-center">
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

      <div className={cn(containerClass, "hero-frame-slot pb-8")}>
        <HeroVideo src={video.src} poster={video.poster} />
      </div>
      <div aria-hidden="true" className="hero-spacer" />
    </div>
  );
}
