"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FAILURE_PHONE, coiProblem, quoteSchema } from "@/lib/form-schema";

export type FormFieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date" | "number" | "file";
  required?: boolean;
  options?: string[];
  helpText?: string;
  /** Rendered and usable, but excluded from submission (no `name` attribute sent). */
  disableSubmission?: boolean;
};

export type FormDestination =
  | { kind: "formsubmit"; email: string; subject: string; autoresponse?: string }
  | { kind: "unresolved" };

export const UNRESOLVED_FORM_NOTICE =
  "This form is not sending yet. The destination address is not confirmed, so nothing is transmitted. Call 234-286-0402 in the meantime.";

export function Form({
  id,
  fields,
  destination,
  submitLabel,
  successMessage,
  source,
  hideDestinationNotice = false,
}: {
  id: string;
  fields: FormFieldConfig[];
  destination: FormDestination;
  submitLabel: string;
  successMessage: string;
  source: string;
  hideDestinationNotice?: boolean;
}) {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [website, setWebsite] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "blocked">("idle");
  const relativeNext = `${source}?sent=${id}`;
  const [nextUrl, setNextUrl] = useState(relativeNext);

  useEffect(() => {
    if (searchParams.get("sent") === id) setStatus("success");
  }, [searchParams, id]);

  useEffect(() => {
    setNextUrl(`${window.location.origin}${relativeNext}`);
    startedAt.current = Date.now();
  }, [relativeNext]);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const empty = fields
      .filter((f) => f.required && f.type !== "file" && values[f.name].trim() === "")
      .map((f) => f.name);
    setMissing(empty);
    setSendError(null);
    if (empty.length > 0 || fileError) {
      e.preventDefault();
      return;
    }
    if (destination.kind === "unresolved") {
      e.preventDefault();
      setStatus("blocked");
      return;
    }
    if (id !== "quote-form") {
      setStatus("submitting");
      return;
    }

    e.preventDefault();
    const parsed = quoteSchema.safeParse(values);
    if (!parsed.success) {
      setMissing(parsed.error.issues.map((issue) => String(issue.path[0])));
      return;
    }
    if (website) return;
    if (Date.now() - startedAt.current < 3000) {
      setSendError("Please wait a moment and send again.");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/forms/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id,
          website,
          startedAt: startedAt.current,
          fields: parsed.data,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; fallback?: boolean; error?: string };
      if (data.ok) {
        setStatus("success");
        toast.success(successMessage);
        return;
      }
      if (data.fallback && formRef.current && destination.kind === "formsubmit") {
        setStatus("idle");
        formRef.current.submit();
        return;
      }
      setStatus("idle");
      setSendError(data.error || `Not sent. Call ${FAILURE_PHONE}.`);
    } catch {
      setStatus("idle");
      setSendError(`Not sent. Call ${FAILURE_PHONE}.`);
    }
  }

  const formAction = destination.kind === "formsubmit" ? `https://formsubmit.co/${encodeURIComponent(destination.email)}` : undefined;

  const steps =
    id === "quote-form"
      ? [
          { label: "Contact", names: ["name", "company", "email", "phone"] },
          { label: "Pallet spec", names: ["spec", "quantity"] },
          { label: "Delivery", names: ["shipTo", "targetDate", "notes"] },
        ]
      : id === "supplier-form"
        ? [
            { label: "Contact", names: ["shopName", "cityState", "contactName", "email", "phone"] },
            { label: "Shop", names: ["equipmentFit", "weeklyCapacity", "specsBuilt"] },
            { label: "Capacity", names: ["leadTime", "heatTreat"] },
          ]
        : id === "carrier-form"
          ? [
              { label: "Contact", names: ["carrierName", "contactName", "email", "phone"] },
              { label: "Authority", names: ["mcNumber", "dotNumber", "equipmentType"] },
              { label: "Lanes", names: ["lanes", "truckCount", "coi"] },
            ]
          : null;
  const [step, setStep] = useState(0);

  return (
    <form
      ref={formRef}
      id={id}
      noValidate
      action={formAction}
      method="POST"
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl"
    >
      <input
        type="text"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />
      {destination.kind === "formsubmit" && (
        <>
          <input type="hidden" name="_subject" value={destination.subject} />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_next" value={nextUrl} />
          {destination.autoresponse && (
            <input type="hidden" name="_autoresponse" value={destination.autoresponse} />
          )}
        </>
      )}
      <input type="hidden" name="source" value={source} />

      {missing.length > 0 && (
        <div className="mb-6 rounded-input border border-gray/25 bg-smoke p-4 text-bone" role="alert">
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="size-4 shrink-0 text-ice" aria-hidden />
            Please, fill in the following fields:
          </p>
          <ul className="mt-2 list-disc pl-5">
            {missing.map((name) => (
              <li key={name}>{fields.find((f) => f.name === name)?.label}</li>
            ))}
          </ul>
        </div>
      )}

      {status === "success" && (
        <p className="mb-6 rounded-input bg-bone/10 p-4 text-bone">{successMessage}</p>
      )}

      {destination.kind === "unresolved" && !hideDestinationNotice && (
        <p className="mb-6 rounded-input border border-bone/30 bg-bone/10 p-4 text-bone">
          {UNRESOLVED_FORM_NOTICE}
        </p>
      )}

      {status === "blocked" && (
        <p className="mb-6 rounded-input bg-bone/10 p-4 text-bone">
          Not sent — the destination above isn&apos;t configured yet. Call {FAILURE_PHONE}.
        </p>
      )}

      {sendError && (
        <p className="mb-6 flex items-start gap-2 rounded-input border border-gray/25 bg-smoke p-4 text-bone" role="alert">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-ice" aria-hidden />
          <span>
            {sendError.includes(FAILURE_PHONE) ? sendError : `${sendError} Call ${FAILURE_PHONE}.`}
          </span>
        </p>
      )}

      {steps ? (
        <div className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray">
            Step {step + 1} of {steps.length}
          </p>
          <ol className="mt-3 flex gap-3">
            {steps.map((s, i) => (
              <li key={s.label} className="min-w-0 flex-1">
                <span className={cn("block h-1 rounded-full", i <= step ? "bg-ice" : "bg-smoke")} />
                <span
                  className={cn(
                    "mt-2 block text-[12px] font-semibold uppercase tracking-[0.08em]",
                    i === step ? "text-bone" : "text-gray"
                  )}
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const isInvalid = missing.includes(field.name);
          const inputClass = cn(
            "w-full rounded-input border border-gray/25 bg-smoke px-4 text-body text-bone outline-hidden",
            "focus-visible:border-ice focus-visible:ring-2 focus-visible:ring-ice",
            field.type === "textarea" ? "min-h-32 py-3" : "h-[52px]",
            isInvalid && "border-ice"
          );
          const wrapperClass =
            field.type === "textarea" || field.type === "file" ? "sm:col-span-2" : undefined;
          const submitName = destination.kind === "formsubmit" && !field.disableSubmission ? field.name : undefined;

          const hidden = steps ? !steps[step].names.includes(field.name) : false;

          return (
            <label key={field.name} className={cn(wrapperClass, hidden && "hidden")}>
              <span className="mb-2 block text-body font-semibold text-bone">
                {field.label}
                {field.required ? null : <span className="font-normal text-gray"> (optional)</span>}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  name={submitName}
                  required={field.required}
                  rows={5}
                  className={inputClass}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  name={submitName}
                  required={field.required}
                  className={inputClass}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="" />
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <input
                  name={submitName}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className={inputClass}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFileError(file ? coiProblem(file) : null);
                  }}
                />
              ) : (
                <input
                  name={submitName}
                  required={field.required}
                  type={field.type}
                  inputMode={field.type === "tel" ? "tel" : undefined}
                  className={inputClass}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
              {field.type === "file" && fileError && (
                <span className="mt-2 flex items-center gap-2 text-[14px] text-ice">
                  <AlertCircle className="size-4 shrink-0" aria-hidden />
                  {fileError}
                </span>
              )}
              {isInvalid && (
                <span className="mt-2 flex items-center gap-2 text-[14px] text-ice">
                  <AlertCircle className="size-4 shrink-0" aria-hidden />
                  This field is required.
                </span>
              )}
              {field.helpText && <span className="mt-1 block text-link text-gray">{field.helpText}</span>}
            </label>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {steps && step > 0 ? (
          <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        ) : null}
        {steps && step < steps.length - 1 ? (
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              const names = steps[step].names;
              const empty = fields
                .filter((f) => names.includes(f.name) && f.required && f.type !== "file" && values[f.name].trim() === "")
                .map((f) => f.name);
              setMissing(empty);
              if (empty.length === 0) setStep((s) => s + 1);
            }}
          >
            Next
          </Button>
        ) : (
          <Button type="submit" variant="primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
