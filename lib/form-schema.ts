import { z } from "zod";

export const QUOTE_TO = "sales@aglpallet.com";
export const QUOTE_SUBJECT = "AGL Pallet website quote request";
export const QUOTE_AUTORESPONSE =
  "Thanks for reaching out to AGL Pallet. We received your spec and will come back to you the same day.";
export const FAILURE_PHONE = "234-286-0402";

const requiredText = z.string().trim().min(1);
const optionalText = z.string().trim().optional().or(z.literal(""));

export const quoteSchema = z.object({
  name: requiredText,
  company: requiredText,
  email: z.string().trim().email(),
  phone: optionalText,
  spec: requiredText,
  quantity: requiredText,
  shipTo: requiredText,
  targetDate: optionalText,
  notes: optionalText,
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const COI_MAX_BYTES = 10 * 1024 * 1024;
const COI_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const COI_EXT = /\.(pdf|jpe?g|png)$/i;

export function coiProblem(file: { size: number; type: string; name: string }): string | null {
  if (file.size > COI_MAX_BYTES) return "Certificate must be 10MB or smaller.";
  const typeOk = COI_TYPES.has(file.type) || (file.type === "" && COI_EXT.test(file.name));
  if (!typeOk) return "Certificate must be a PDF, JPG, or PNG.";
  return null;
}
