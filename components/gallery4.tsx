"use client";

// Adapted from @shadcnblocks/gallery4 (free). Carousel skeleton kept; demo
// SaaS case-study copy and CDN images removed. Items required (no defaults).
// Restyled: parchment ground, AGL green controls, clay rules, local imagery.
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { getBlurDataURL } from "@/lib/blur";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  eyebrow?: string;
  title: string;
  description?: string;
  items: Gallery4Item[];
  className?: string;
  tone?: "paper" | "green";
}

export function Gallery4({
  eyebrow,
  title,
  description,
  items,
  className,
  tone = "paper",
}: Gallery4Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const onGreen = tone === "green";

  const sync = useCallback((instance: CarouselApi) => {
    if (!instance) return;
    setCanPrev(instance.canScrollPrev());
    setCanNext(instance.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;
    sync(api);
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api, sync]);

  return (
    <section
      className={cn(
        "section-y scroll-mt-24 overflow-hidden px-6",
        onGreen ? "bg-brand-green text-cream" : "bg-paper text-ink",
        className,
      )}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-6 nav:mb-14 nav:flex-row nav:items-end nav:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p
                className={cn(
                  "text-eyebrow font-semibold uppercase tracking-wide",
                  onGreen ? "text-fog-green" : "text-eyebrow-ink",
                )}
              >
                <span aria-hidden="true" className={cn("mr-2 font-bold", onGreen ? "text-clay" : "text-brand-green")}>
                  /
                </span>
                {eyebrow}
              </p>
            )}
            <h2 className={cn("mt-4 text-display-2", onGreen ? "text-cream" : "text-brand-green")}>{title}</h2>
            {description && (
              <p className={cn("prose-measure mt-4 text-body", onGreen ? "text-cream/80" : "text-ink/75")}>
                {description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => api?.scrollPrev()}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full border transition-colors disabled:opacity-40",
                onGreen
                  ? "border-cream/30 text-cream hover:bg-cream/10"
                  : "border-brand-green/30 text-brand-green hover:bg-brand-green/5",
              )}
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => api?.scrollNext()}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full border transition-colors disabled:opacity-40",
                onGreen
                  ? "border-cream/30 text-cream hover:bg-cream/10"
                  : "border-brand-green/30 text-brand-green hover:bg-brand-green/5",
              )}
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        <Carousel setApi={setApi} opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-4">
            {items.map((item) => {
              const blur = getBlurDataURL(item.image);
              return (
                <CarouselItem key={item.id} className="basis-[85%] pl-4 sm:basis-1/2 nav:basis-1/3">
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "group flex h-full flex-col overflow-hidden rounded-sm ring-1 transition-shadow",
                      onGreen
                        ? "bg-brand-green/40 ring-clay/30 hover:ring-clay/60"
                        : "bg-cream ring-clay/40 hover:shadow-[0_20px_40px_-28px_rgba(31,42,31,0.35)]",
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        quality={70}
                        sizes="(min-width: 980px) 30vw, 85vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        placeholder={blur ? "blur" : undefined}
                        blurDataURL={blur}
                      />
                      <div
                        aria-hidden="true"
                        className={cn("absolute inset-0", onGreen ? "bg-brand-green/25" : "bg-brand-green/10")}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className={cn("text-display-row", onGreen ? "text-cream" : "text-brand-green")}>
                        {item.title}
                      </h3>
                      <span aria-hidden="true" className="mt-3 block h-px w-8 bg-clay" />
                      <p className={cn("mt-3 text-body", onGreen ? "text-cream/75" : "text-ink/70")}>
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
