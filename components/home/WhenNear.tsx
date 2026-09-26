"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

// Mounts a next/dynamic chunk once the placeholder is within about one
// viewport. The placeholder stays in the document until that chunk has
// evaluated, and minHeight covers the one frame dynamic() can render empty.
export function WhenNear<P extends object>({
  load,
  componentProps,
  placeholder,
}: {
  load: () => Promise<{ default: ComponentType<P> }>;
  componentProps: P;
  placeholder: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const loadRef = useRef(load);
  const [minHeight, setMinHeight] = useState<number>();
  const [Comp, setComp] = useState<ComponentType<P> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        const height = el.getBoundingClientRect().height;
        loadRef.current().then((mod) => {
          if (cancelled) return;
          if (height > 0) setMinHeight(Math.round(height));
          setComp(() => mod.default);
        });
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {Comp ? <Comp {...componentProps} /> : placeholder}
    </div>
  );
}
