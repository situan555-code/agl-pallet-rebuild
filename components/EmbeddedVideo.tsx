"use client";

import { useEffect, useRef, useState } from "react";

export function EmbeddedVideo({
  src,
  poster,
  controls,
  autoPlay,
  muted,
  loop,
}: {
  src: string;
  poster?: string;
  controls: boolean;
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Defer fetching the poster/video source until this section is about to
  // scroll into view, so an autoplaying below-the-fold video never competes
  // with the page's real LCP image for bandwidth on initial load.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shouldAutoPlay = nearViewport && autoPlay && !reduceMotion;

  return (
    <section ref={sectionRef} className="section-y relative bg-paper px-6">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-paper" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1000px]">
        <video
          src={nearViewport ? src : undefined}
          poster={nearViewport ? poster : undefined}
          controls={controls || reduceMotion}
          autoPlay={shouldAutoPlay}
          muted={muted}
          loop={loop && !reduceMotion}
          playsInline
          preload="none"
          className="w-full bg-surface-alt"
        />
      </div>
    </section>
  );
}
