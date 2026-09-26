// Server-rendered calculator building blocks. Forms submit with GET to the
// same page, so results are computed on the server and arrive as HTML; no
// client JavaScript is needed to get a number.
import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/resources/RichText";

const inputClass =
  "mt-2 block h-[52px] w-full rounded-input border border-moss/25 bg-transparent px-3 text-[16px] text-moss focus-visible:border-moss focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-moss";

const labelClass = "block text-[14px] font-semibold leading-snug text-moss";

export function CalcForm({
  action,
  resetHref,
  submitLabel = "Calculate",
  resetLabel = "Reset to defaults",
  label,
  children,
}: {
  action: string;
  resetHref: string;
  submitLabel?: string;
  resetLabel?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <form method="get" action={action} aria-label={label} className="mt-6">
      {children}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit" variant="secondary">
          {submitLabel}
        </Button>
        <Link
          href={resetHref}
          prefetch={false}
          className="text-link font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green"
        >
          {resetLabel}
        </Link>
      </div>
    </form>
  );
}

export function FieldGroup({ legend, children, columns = 3 }: { legend: string; children: ReactNode; columns?: 2 | 3 | 4 }) {
  return (
    <fieldset className="mt-6 border-t border-brand-green/15 pt-5 first:mt-0">
      <legend className="float-left mb-4 w-full text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">{legend}</legend>
      <div
        className={cn(
          "clear-left grid grid-cols-2 gap-x-5 gap-y-4",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "sm:grid-cols-4"
        )}
      >
        {children}
      </div>
    </fieldset>
  );
}

export function NumberField({
  name,
  label,
  unit,
  value,
  min,
  max,
  step = "any",
  required = true,
  placeholder,
}: {
  name: string;
  label: string;
  unit?: string;
  value?: number;
  min: number;
  max: number;
  step?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>
        {label}
        {unit && <span className="font-normal text-ink/70"> ({unit})</span>}
      </span>
      <input
        type="number"
        inputMode="decimal"
        name={name}
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

export function SelectField({
  name,
  label,
  value,
  options,
  wide,
}: {
  name: string;
  label: string;
  value: string;
  options: { id: string; label: string }[];
  wide?: boolean;
}) {
  return (
    <label className={cn("block min-w-0", wide && "col-span-2 sm:col-span-3")}>
      <span className={labelClass}>{label}</span>
      <select name={name} defaultValue={value} className={inputClass}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Headline figure plus supporting lines. Text stays in ink tokens. */
export function ResultSummary({ label, value, detail }: { label: string; value: string; detail?: ReactNode }) {
  return (
    <div className="border-l-[3px] border-brand-green pl-6">
      <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">{label}</p>
      <p className="mt-1 font-display text-display-numeral text-brand-green">{value}</p>
      {detail && <div className="prose-measure mt-2 text-body text-ink/85">{detail}</div>}
    </div>
  );
}

export function NoteList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="mt-8">
      <h3 className="text-step-lg text-current">{heading}</h3>
      <ul className="prose-measure mt-4 list-disc space-y-2 pl-5 text-body text-ink/85">
        {items.map((item, i) => (
          <li key={i} className="pl-1">
            <RichText text={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Disclaimer({ text }: { text: string }) {
  return <p className="prose-measure mt-6 text-[14px] leading-relaxed text-ink/70">{text}</p>;
}
