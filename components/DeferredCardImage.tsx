"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** Loads the photo after window load so the page H1 can stay LCP. */
export function DeferredCardImage({
  src,
  eager = false,
}: {
  src: string;
  eager?: boolean;
}) {
  const [ready, setReady] = useState(eager);

  useEffect(() => {
    if (eager) return;
    const start = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
      ric(() => setReady(true));
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }, [eager]);

  if (!ready) return <div className="absolute inset-0 bg-smoke" aria-hidden />;

  return (
    <Image
      src={src}
      alt=""
      fill
      quality={50}
      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 360px"
      className="object-cover"
      priority={eager}
    />
  );
}
