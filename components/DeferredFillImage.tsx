"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type DeferredFillImageProps = {
  src: string;
  alt: string;
  quality?: number;
  sizes?: string;
  className?: string;
};

// The frame is server-rendered. The file request starts after first paint so
// it is not part of the text LCP graph. The parent box keeps its size.
export function DeferredFillImage({ src, alt, quality, sizes, className }: DeferredFillImageProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const kick = () => setShow(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(kick, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(kick, 400);
    return () => window.clearTimeout(t);
  }, []);
  if (!show) return null;
  return <Image src={src} alt={alt} fill quality={quality} sizes={sizes} className={className} />;
}
