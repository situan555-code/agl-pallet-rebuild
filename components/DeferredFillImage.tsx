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
    setShow(true);
  }, []);
  if (!show) return null;
  return <Image src={src} alt={alt} fill quality={quality} sizes={sizes} className={className} />;
}
