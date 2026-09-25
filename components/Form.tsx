"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

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

export function Form({
  id,
  fields,
  destination,
  submitLabel,
  successMessage,
  source,
}: {
  id: string;
  fields: FormFieldConfig[];
  destination: FormDestination;
  submitLabel: string;
  successMessage: string;
  source: string;
}) {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [missing, setMissing] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "blocked">("idle");
  const relativeNext = `${source}?sent=${id}`;
  const [nextUrl, setNextUrl] = useState(relativeNext);

  useEffect(() => {
    if (searchParams.get("sent") === id) setStatus("success");
  }, [searchParams, id]);

  useEffect(() => {
    setNextUrl(`${window.location.origin}${relativeNext}`);
  }, [relativeNext]);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const empty = fields
      .filter((f) => f.required && f.type !== "file" && values[f.name].trim() === "")
      .map((f) => f.name);
    setMissing(empty);
    if (empty.length > 0) {
      e.preventDefault();
      return;
    }
    if (destination.kind === "unresolved") {
      e.preventDefault();
      setStatus("blocked");
      return;
    }
    setStatus("submitting");
    // Native POST continues to FormSubmit (no preventDefault).
  }

  const formAction = destination.kind === "formsubmit" ? `https://formsubmit.co/${encodeURIComponent(destination.email)}` : undefined;

  return (
    <form
      id={id}
      noValidate
      action={formAction}
      method="POST"
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl"
    >
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
        <div className="mb-6 rounded-input border border-red-500 bg-red-500/10 p-4 text-white">
          <p className="font-semibold">Please, fill in the following fields:</p>
          <ul className="mt-2 list-disc pl-5">
            {missing.map((name) => (
              <li key={name}>{fields.find((f) => f.name === name)?.label}</li>
            ))}
          </ul>
        </div>
      )}

      {status === "success" && (
        <p className="mb-6 rounded-input bg-white/10 p-4 text-white">{successMessage}</p>
      )}

      {destination.kind === "unresolved" && (
        <p className="mb-6 rounded-input border border-white/30 bg-white/10 p-4 text-white">
          This form is not sending yet. The destination address is not confirmed, so nothing is
          transmitted. Call 234-286-0402 in the meantime.
        </p>
      )}

      {status === "blocked" && (
        <p className="mb-6 rounded-input bg-white/10 p-4 text-white">
          Not sent — the destination above isn&apos;t configured yet.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const isInvalid = missing.includes(field.name);
          const inputClass = `w-full rounded-input border bg-white px-4 py-3 text-ink text-body outline-hidden ${
            isInvalid ? "border-red-500" : "border-transparent"
          }`;
          const wrapperClass =
            field.type === "textarea" || field.type === "file" ? "sm:col-span-2" : undefined;
          const submitName = destination.kind === "formsubmit" && !field.disableSubmission ? field.name : undefined;

          return (
            <label key={field.name} className={wrapperClass}>
              <span className="mb-2 block text-white text-button font-semibold">
                {field.label}
                {field.required ? "" : " (optional)"}
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
                  onChange={() => {}}
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
              {field.helpText && <span className="mt-1 block text-link text-white/70">{field.helpText}</span>}
            </label>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 rounded-full bg-white px-6 py-[15px] text-button font-bold text-brand-green transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
