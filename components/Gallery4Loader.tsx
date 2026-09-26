"use client";

// The carousel chunk loads with next/dynamic only once this block is within
// about one viewport. A top-level next/dynamic() in this file was still
// emitted as an initial script, so the dynamic() call lives in load-gallery.
import Image from "next/image";
import Link from "next/link";
import type { Gallery4Props } from "@/components/gallery4";
import { containerClass } from "@/components/Container";
import { WhenNear } from "@/components/home/WhenNear";
import { getBlurDataURL } from "@/lib/blur";
import { cn } from "@/lib/utils";

function load() {
  return import("@/components/home/load-gallery").then((mod) => mod.loadGallery());
}

function GalleryPlaceholder({ eyebrow, title, description, items, className }: Gallery4Props) {
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
            <span
              aria-hidden
              className="inline-flex size-11 items-center justify-center rounded-full border border-ice bg-green"
            />
            <span
              aria-hidden
              className="inline-flex size-11 items-center justify-center rounded-full border border-ice bg-green"
            />
          </div>
        </div>
        <div className="relative w-full">
          <div className="overflow-hidden">
            <div className="flex -ml-4">
              {items.map((item) => {
                const blur = getBlurDataURL(item.image);
                return (
                  <div
                    key={item.id}
                    className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-1/2 nav:basis-1/3"
                  >
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
                          className="object-cover"
                          placeholder={blur ? "blur" : undefined}
                          blurDataURL={blur}
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-display-row text-current">{item.title}</h3>
                        <p className="mt-5 text-body text-current/75">{item.description}</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Gallery4Loader(props: Gallery4Props) {
  return <WhenNear load={load} componentProps={props} placeholder={<GalleryPlaceholder {...props} />} />;
}
