// design-sync shim for next/dynamic: React.lazy + Suspense with the optional
// `loading` fallback. The bundle inlines the dynamic import, so it resolves
// on the next tick.
import { lazy, Suspense, type ComponentType } from "react";

type Loader<P> = () => Promise<ComponentType<P> | { default: ComponentType<P> }>;

export default function dynamic<P extends object>(
  loader: Loader<P>,
  options?: { loading?: ComponentType<object>; ssr?: boolean },
): ComponentType<P> {
  const Lazy = lazy(async () => {
    const m = await loader();
    return { default: (typeof m === "function" ? m : (m as { default: ComponentType<P> }).default) as ComponentType<P> };
  });
  const Fallback = options?.loading;
  return function DynamicComponent(props: P) {
    return (
      <Suspense fallback={Fallback ? <Fallback /> : null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}
