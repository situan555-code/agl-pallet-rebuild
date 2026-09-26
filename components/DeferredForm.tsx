"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { FormDestination, FormFieldConfig } from "@/components/Form";

type FormProps = {
  id: string;
  fields: FormFieldConfig[];
  destination: FormDestination;
  submitLabel: string;
  successMessage: string;
  source: string;
  hideDestinationNotice?: boolean;
};

// The quote H1 is the LCP element. Form JS (zod, sonner, search params) is
// not needed for that paint — mount it after idle inside a reserved box.
export function DeferredForm(props: FormProps) {
  const [Form, setForm] = useState<ComponentType<FormProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const kick = () => {
      void import("@/components/Form").then((mod) => {
        if (!cancelled) setForm(() => mod.Form);
      });
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(kick, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(kick, 1);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  if (!Form) return <div className="min-h-[36rem] nav:min-h-0" aria-hidden />;
  return <Form {...props} />;
}
