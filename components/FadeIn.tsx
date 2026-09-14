"use client";

export function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // Motion disabled for LCP: opacity:0 + IntersectionObserver was delaying
  // largest-contentful-paint on product/side images. G22: remaining CSS
  // fade utilities respect prefers-reduced-motion in globals.css.
  return <div className={className}>{children}</div>;
}
