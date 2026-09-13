"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

type FieldName =
  | "fullName"
  | "companyName"
  | "email"
  | "phone"
  | "palletDimensions"
  | "palletQuantity"
  | "message";

const FIELDS: {
  name: FieldName;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
}[] = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "companyName", label: "Company Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "phone", label: "Phone Number", type: "tel" },
  { name: "palletDimensions", label: "Pallet Dimensions", type: "text" },
  { name: "palletQuantity", label: "Estimated Pallet Quantity", type: "text" },
  { name: "message", label: "Message", type: "textarea" },
];

const EMPTY_FORM: Record<FieldName, string> = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  palletDimensions: "",
  palletQuantity: "",
  message: "",
};

export function ContactForm({ to }: { to: string }) {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY_FORM);
  const [missing, setMissing] = useState<FieldName[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  useEffect(() => {
    if (searchParams.get("sent") === "1") setStatus("success");
  }, [searchParams]);

  function handleChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const empty = FIELDS.filter((f) => values[f.name].trim() === "").map((f) => f.name);
    setMissing(empty);
    if (empty.length > 0) {
      e.preventDefault();
      return;
    }
    setStatus("submitting");
    // Native POST continues to FormSubmit (no preventDefault).
  }

  const nextUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/request-a-quote/?sent=1`
      : "https://nx7k-lab-m4.vercel.app/request-a-quote/?sent=1";

  return (
    <form
      noValidate
      action={`https://formsubmit.co/${encodeURIComponent(to)}`}
      method="POST"
      onSubmit={handleSubmit}
      className="mt-8 max-w-2xl"
    >
      <input type="hidden" name="_subject" value="AGL Pallet website quote request" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={nextUrl} />

      {missing.length > 0 && (
        <div className="mb-6 rounded-input border border-red-500 bg-red-500/10 p-4 text-white">
          <p className="font-semibold">Please, fill in the following fields:</p>
          <ul className="mt-2 list-disc pl-5">
            {missing.map((name) => (
              <li key={name}>{FIELDS.find((f) => f.name === name)?.label}</li>
            ))}
          </ul>
        </div>
      )}

      {status === "success" && (
        <p className="mb-6 rounded-input bg-white/10 p-4 text-white">
          Thanks — your message has been sent. Someone from AGL Pallet will follow up promptly.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const isInvalid = missing.includes(field.name);
          const inputClass = `w-full rounded-input border bg-white px-4 py-3 text-ink text-body outline-none ${
            isInvalid ? "border-red-500" : "border-transparent"
          }`;
          const wrapperClass = field.type === "textarea" ? "sm:col-span-2" : undefined;
          // FormSubmit reads the `name` attribute.
          const submitName =
            field.name === "fullName"
              ? "name"
              : field.name === "companyName"
                ? "company"
                : field.name;
          return (
            <label key={field.name} className={wrapperClass}>
              <span className="mb-2 block text-white text-button font-semibold">
                {field.label}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  name={submitName}
                  required
                  rows={5}
                  className={inputClass}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <input
                  name={submitName}
                  required
                  type={field.type}
                  inputMode={field.type === "tel" ? "tel" : undefined}
                  className={inputClass}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </label>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 rounded-full bg-white px-6 py-[15px] text-button font-bold text-brand-green transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
