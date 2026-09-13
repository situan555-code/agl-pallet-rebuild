"use client";

import { useState, type FormEvent } from "react";

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
  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY_FORM);
  const [missing, setMissing] = useState<FieldName[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleChange(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const empty = FIELDS.filter((f) => values[f.name].trim() === "").map((f) => f.name);
    setMissing(empty);
    if (empty.length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    try {
      // Browser → FormSubmit (Vercel server IPs are Cloudflare-blocked).
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          company: values.companyName,
          _replyto: values.email,
          _subject: `Quote request from ${values.fullName} (${values.companyName})`,
          _template: "table",
          _captcha: "false",
          message: [
            `Full Name: ${values.fullName}`,
            `Company Name: ${values.companyName}`,
            `Email Address: ${values.email}`,
            `Phone Number: ${values.phone}`,
            `Pallet Dimensions: ${values.palletDimensions}`,
            `Estimated Pallet Quantity: ${values.palletQuantity}`,
            `Message: ${values.message}`,
          ].join("\n"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: string | boolean;
        message?: string;
      };
      const ok =
        res.ok &&
        (data.success === true ||
          data.success === "true" ||
          // Activation-pending still means the pipeline works; inbox must click once.
          (typeof data.message === "string" && data.message.toLowerCase().includes("activation")));
      if (!ok) throw new Error(data.message || "request failed");
      setStatus("success");
      setValues(EMPTY_FORM);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="mt-8 max-w-2xl">
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
      {status === "error" && (
        <p className="mb-6 rounded-input border border-red-500 bg-red-500/10 p-4 text-white">
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const isInvalid = missing.includes(field.name);
          const inputClass = `w-full rounded-input border bg-white px-4 py-3 text-ink text-body outline-none ${
            isInvalid ? "border-red-500" : "border-transparent"
          }`;
          const wrapperClass = field.type === "textarea" ? "sm:col-span-2" : undefined;
          return (
            <label key={field.name} className={wrapperClass}>
              <span className="mb-2 block text-white text-button font-semibold">
                {field.label}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  rows={5}
                  className={inputClass}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <input
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
