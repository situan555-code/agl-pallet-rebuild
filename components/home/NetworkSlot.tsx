"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

type NetworkProps = {
  mills: string[];
  center: string;
  right: string;
  className?: string;
};

/**
 * Static diagram is the server HTML (first paint and reduced motion).
 * The animated beam chunk loads only after window load, and only once the
 * diagram is within one viewport. It is not imported on the home critical path.
 */
export function NetworkSlot({
  children,
  ...props
}: NetworkProps & { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number>();
  const [Beam, setBeam] = useState<ComponentType<NetworkProps> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let pageLoaded = document.readyState === "complete";
    let near = false;
    let started = false;

    const mount = () => {
      if (cancelled || started || !pageLoaded || !near) return;
      started = true;
      const height = el.getBoundingClientRect().height;
      void import("@/components/NetworkBeam").then((mod) => {
        if (cancelled) return;
        if (height > 0) setMinHeight(Math.round(height));
        setBeam(() => mod.NetworkBeam);
      });
    };

    const onLoad = () => {
      pageLoaded = true;
      mount();
    };
    if (!pageLoaded) window.addEventListener("load", onLoad, { once: true });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        near = true;
        io.disconnect();
        mount();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      io.disconnect();
    };
  }, []);

  const Active = Beam;
  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {Active ? <Active {...props} /> : children}
    </div>
  );
}
