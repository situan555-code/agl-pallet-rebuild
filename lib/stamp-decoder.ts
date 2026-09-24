import copy from "@/content/resources/stamp-decoder.json";
import { hyphenRulePlain, stampFieldCopy, treatmentCodes } from "@/lib/download-source";

// Format check only. The hyphen is the joiner between the country code and
// the producer number (guide example US-1234). APHIS/CBP enforcement text
// is the guide sentence, not a second write-up of the date.
// Producer numbers are not given one global length in the guide, so this
// accepts 1–16 letters or digits and rejects a hyphen inside either field.

const PRODUCER_RE = /^[A-Z0-9]{1,16}$/;
const COUNTRY_RE = /^[A-Z]{2}$/;

export const stampDecoderCopy = copy;

export type StampField = "country" | "producer" | "treatment";

export interface StampInput {
  country: string;
  producer: string;
  treatment: string;
  dun: boolean;
}

export interface StampError {
  field: StampField;
  message: string;
}

export interface StampResult {
  submitted: boolean;
  input: StampInput;
  errors: StampError[];
  ok: boolean;
  mark?: string;
  treatmentCode?: string;
  treatmentName?: string;
  treatmentInvolves?: string;
}

function one(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().toUpperCase();
}

export function stampSubmitted(searchParams: Record<string, string | string[] | undefined>) {
  return ["cc", "producer", "treatment", "dun"].some((key) => searchParams[key] !== undefined);
}

export function stampInputFromParams(searchParams: Record<string, string | string[] | undefined>): StampInput {
  const dun = one(searchParams.dun);
  return {
    country: one(searchParams.cc),
    producer: one(searchParams.producer),
    treatment: one(searchParams.treatment),
    dun: dun === "1" || dun === "ON" || dun === "TRUE" || dun === "YES",
  };
}

function hyphenError(message: string) {
  return `${message} ${hyphenRulePlain()}`;
}

export function decodeStamp(raw: StampInput): StampResult {
  const input: StampInput = {
    country: raw.country.trim().toUpperCase(),
    producer: raw.producer.trim().toUpperCase(),
    treatment: raw.treatment.trim().toUpperCase(),
    dun: raw.dun,
  };
  const errors: StampError[] = [];
  const codes = treatmentCodes();
  const known = new Set(codes.map((row) => row.code));

  if (input.country.includes("-")) {
    errors.push({ field: "country", message: hyphenError(copy.errors.countryHyphen) });
  } else if (!COUNTRY_RE.test(input.country)) {
    errors.push({ field: "country", message: hyphenError(copy.errors.countryShape) });
  }

  if (!input.producer) {
    errors.push({ field: "producer", message: hyphenError(copy.errors.producerMissing) });
  } else if (input.producer.includes("-")) {
    errors.push({ field: "producer", message: hyphenError(copy.errors.producerHyphen) });
  } else if (!PRODUCER_RE.test(input.producer)) {
    errors.push({ field: "producer", message: copy.errors.producerShape });
  }

  const treatment = codes.find((row) => row.code === input.treatment);
  if (!treatment || !known.has(input.treatment)) {
    const list = codes.map((row) => row.code).join(", ");
    errors.push({ field: "treatment", message: `${copy.errors.treatment} ${list}.` });
  }

  const ok = errors.length === 0;
  const base: StampResult = {
    submitted: true,
    input,
    errors,
    ok,
  };
  if (!ok || !treatment) return base;
  return {
    ...base,
    mark: `${input.country}-${input.producer}`,
    treatmentCode: treatment.code,
    treatmentName: treatment.name,
    treatmentInvolves: treatment.involves,
  };
}

export function decodeStampParams(searchParams: Record<string, string | string[] | undefined>): StampResult | null {
  if (!stampSubmitted(searchParams)) return null;
  return decodeStamp(stampInputFromParams(searchParams));
}

function assertDecoder() {
  const fields = stampFieldCopy();
  if (!/hyphen/i.test(fields.country) || !fields.producer.includes("January 1, 2026")) {
    throw new Error("decoder explanations lost the hyphen rule");
  }
  if (!/\bDUN\b/.test(fields.dun)) throw new Error("decoder explanations lost DUN");

  const good = decodeStamp({ country: "us", producer: "1234", treatment: "ht", dun: false });
  if (!good.ok || good.mark !== "US-1234" || good.treatmentCode !== "HT") {
    throw new Error("decoder rejected the guide's hyphen example");
  }
  const dun = decodeStamp({ country: "CA", producer: "9", treatment: "SF", dun: true });
  if (!dun.ok || dun.mark !== "CA-9" || !dun.input.dun) throw new Error("DUN flag failed");
  const dh = decodeStamp({ country: "US", producer: "1234", treatment: "DH", dun: false });
  if (!dh.ok) throw new Error("DH should pass");
  const mb = decodeStamp({ country: "US", producer: "ABCD12", treatment: "MB", dun: false });
  if (!mb.ok || mb.mark !== "US-ABCD12") throw new Error("alphanumeric producer should pass");

  const hyphenInProducer = decodeStamp({ country: "US", producer: "12-34", treatment: "HT", dun: false });
  if (hyphenInProducer.ok || !hyphenInProducer.errors.some((error) => error.field === "producer")) {
    throw new Error("hyphen inside the producer number should fail");
  }
  const hyphenInCountry = decodeStamp({ country: "US-1234", producer: "1", treatment: "HT", dun: false });
  if (hyphenInCountry.ok || !hyphenInCountry.errors.some((error) => error.field === "country")) {
    throw new Error("hyphen inside the country code should fail");
  }
  const glued = decodeStamp({ country: "USA", producer: "1234", treatment: "HT", dun: false });
  if (glued.ok) throw new Error("a three-letter country code should fail");
  const kiln = decodeStamp({ country: "US", producer: "1234", treatment: "KD", dun: false });
  if (kiln.ok) throw new Error("KD is not a treatment code on the guide");
  const empty = decodeStamp({ country: "", producer: "", treatment: "", dun: false });
  if (empty.ok) throw new Error("empty mark should fail");

  const mark = good.mark ?? "";
  if (!/^[A-Z]{2}-[A-Z0-9]+$/.test(mark)) throw new Error("assembled mark is missing the hyphen");
}

assertDecoder();
