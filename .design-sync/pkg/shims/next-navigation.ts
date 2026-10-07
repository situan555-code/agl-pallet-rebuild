// design-sync shim for next/navigation: static, router-less values.
export function usePathname(): string {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
}

export function useRouter() {
  const go = (href: string) => {
    if (typeof window !== "undefined") window.location.assign(href);
  };
  return { push: go, replace: go, back: () => history.back(), forward: () => history.forward(), refresh: () => {}, prefetch: () => {} };
}

export function useParams(): Record<string, string> {
  return {};
}

export function notFound(): never {
  throw new Error("notFound() is not available outside Next.js");
}

export function redirect(href: string): never {
  throw new Error(`redirect(${href}) is not available outside Next.js`);
}
