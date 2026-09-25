"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** Poster is LCP. Native video starts after mount when motion is allowed. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setPlay(true))
      : window.setTimeout(() => setPlay(true), 400);
    return () => {
      if (window.cancelIdleCallback && typeof id === "number") window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-green">
      <Image
        src={poster}
        alt=""
        fill
        priority
        quality={60}
        sizes="(min-width: 1024px) 960px, calc(100vw - 3rem)"
        className="object-cover object-center"
      />
      {play ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          src={src}
        />
      ) : null}
    </div>
  );
}
