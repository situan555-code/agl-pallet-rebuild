"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { DeferredFillImage } from "@/components/DeferredFillImage";

const VideoPlayer = dynamic(
  () => import("@/components/video-player/player").then((mod) => mod.VideoPlayer),
  { ssr: false }
);

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [engage, setEngage] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          setEngage(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.4, 0.75] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const play = !reduceMotion || engage;

  return (
    <div ref={frameRef} className="absolute inset-0 bg-brand-green">
      <DeferredFillImage
        src={poster}
        alt=""
        quality={60}
        sizes="(min-width: 1024px) 960px, calc(100vw - 3rem)"
        className="object-cover object-center"
      />
      {engage ? (
        <VideoPlayer
          chrome="quiet"
          className="absolute inset-0 size-full bg-transparent"
          layout="fill"
          source={{ id: "home-hero", poster, src }}
          loading={{ autoplayFirst: play }}
          mediaProps={{
            autoPlay: play,
            className: "absolute inset-0 h-full w-full min-h-0 min-w-0 bg-brand-green object-cover",
            loop: !reduceMotion,
            muted: true,
            playsInline: true,
            poster,
            preload: "none",
          }}
        />
      ) : (
        <button
          type="button"
          className="absolute bottom-3 left-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-cream hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          aria-label="Play"
          onClick={() => setEngage(true)}
        >
          <PlayGlyph />
        </button>
      )}
    </div>
  );
}
