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

  return (
    <section ref={sectionRef} className="relative bg-surface px-6 py-[85px]">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-surface-alt" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1000px]">
        <video
          src={nearViewport ? src : undefined}
          poster={nearViewport ? poster : undefined}
          controls={controls}
          autoPlay={nearViewport && autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          preload="none"
          className="w-full bg-surface-alt"
        />
      </div>
    </section>
  );
}
