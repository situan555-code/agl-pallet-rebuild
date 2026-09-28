"use client";

import { createContext, useContext, useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { pageField, type PageField } from "@/lib/page-field";

const FieldContext = createContext<PageField>("dark");

export function usePageField() {
  return useContext(FieldContext);
}

function applyField(field: PageField) {
  const html = document.documentElement;
  const body = document.body;
  html.dataset.field = field;
  const light = field === "light";
  body.classList.toggle("surface-light", light);
  body.classList.toggle("bg-bone", light);
  body.classList.toggle("text-moss", light);
  body.classList.toggle("bg-moss", !light);
  body.classList.toggle("text-bone", !light);
}

/** Keeps html/body field in sync on client navigations. Root layout does not re-render. */
export function FieldProvider({
  initialField,
  children,
}: {
  initialField: PageField;
  children: ReactNode;
}) {
  const field = pageField(usePathname()) || initialField;

  useLayoutEffect(() => {
    applyField(field);
  }, [field]);

  return <FieldContext.Provider value={field}>{children}</FieldContext.Provider>;
}
