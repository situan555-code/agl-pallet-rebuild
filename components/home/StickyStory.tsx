"use client";

// Sticky column adapted from the UI Layouts sticky-scroll interaction
// (content scrolls, media stays pinned). Styling is AGL's field, not the demo.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LazyHeroVideo } from "@/components/LazyHeroVideo";
import { cn } from "@/lib/utils";

export type StoryBeat = {
  kicker: string;
  heading: string;
  body: string;
};

const FRAMES = [
  { scale: 1, position: "center" },
  { scale: 1.03, position: "center 42%" },
  { scale: 1, position: "center 58%" },
  { scale: 1, position: "center" },
] as const;

function Media({
  video,
  frame,
}: {
  video: { src: string; poster: string };
  frame: (typeof FRAMES)[number];
}) {
  return (
    <div className="relative aspect-16/10 max-h-[70vh] w-full overflow-hidden rounded-section bg-moss">
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `scale(${frame.scale})` }}
      >
        <Image
          src={video.poster}
          alt=""
          fill
          quality={60}
          sizes="(max-width: 979px) calc(100vw - 48px), 58vw"
          className="object-cover"
          style={{ objectPosition: frame.position }}
        />
        <LazyHeroVideo src={video.src} />
      </div>
    </div>
  );
}

export function StickyStory({
  beats,
  video,
}: {
  beats: StoryBeat[];
  video: { src: string; poster: string };
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const nodes = refs.current.filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const index = Number((hit.target as HTMLElement).dataset.beat);
        if (!Number.isNaN(index)) setActive(index);
      },
      { rootMargin: "-32% 0px -38% 0px", threshold: [0.2, 0.45, 0.7] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [beats.length]);

  const frame = FRAMES[active] ?? FRAMES[0];

  return (
    <section className="mt-16 scroll-mt-24 nav:mt-20">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 md:px-8 nav:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] nav:items-start nav:gap-20 lg:px-12">
        <div className="nav:hidden">
          <Media video={video} frame={FRAMES[0]} />
        </div>
        <div>
          {beats.map((beat, index) => {
            const on = index === active;
            return (
              <article
                key={beat.heading}
                data-beat={index}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                className={cn(
                  "flex flex-col justify-center py-12 transition-[opacity,transform] duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none nav:min-h-[65vh] nav:py-10",
                  on ? "translate-y-0 opacity-100" : "nav:translate-y-3 nav:opacity-40",
                )}
              >
                {beat.kicker ? (
                  <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">{beat.kicker}</p>
                ) : null}
                <h2 className={cn("text-display-2 text-current", beat.kicker && "mt-3")}>{beat.heading}</h2>
                <p className="prose-measure mt-5 text-body text-current/80">{beat.body}</p>
              </article>
            );
          })}
        </div>
        <div className="hidden nav:block">
          <div className="sticky top-24">
            <Media video={video} frame={frame} />
          </div>
        </div>
      </div>
    </section>
  );
}
