"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
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
}: Gallery4Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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
    <section className={cn("section-y scroll-mt-24 overflow-hidden bg-moss text-bone", className)}>
      <div className={containerClass}>
        <div className="mb-8 flex flex-col gap-6 nav:mb-10 nav:flex-row nav:items-end nav:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">
                <span aria-hidden="true" className="mr-2 font-bold text-current">
                  /
                </span>
                {eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-display-2 text-current">{title}</h2>
            {description && (
              <p className="prose-measure mt-5 text-body text-current/75">{description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => api?.scrollPrev()}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ice bg-green text-ice hover:bg-smoke disabled:opacity-40"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => api?.scrollNext()}
              className="inline-flex size-11 items-center justify-center rounded-full border border-ice bg-green text-ice hover:bg-smoke disabled:opacity-40"
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
                <CarouselItem key={item.id} className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-[31%]">
                  <Link
                    id={item.id}
                    href={item.href}
                    prefetch={false}
                    className="hover-lift group flex h-full flex-col overflow-hidden rounded-card border border-smoke bg-green"
                  >
                    <div className="relative aspect-4/3 overflow-hidden">
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
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-display-row text-current">{item.title}</h3>
                      <p className="mt-5 text-body text-current/75">{item.description}</p>
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
