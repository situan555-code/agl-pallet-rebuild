import Link from "next/link";
import { Button } from "@/components/ui/button";
import { containerClass } from "@/components/Container";
import { cn } from "@/lib/utils";
import ispm from "@/content/resources/pillars/heat-treated-pallets-ispm-15.json";
import { BreadcrumbJsonLd, WebApplicationJsonLd } from "@/components/JsonLd";
import { ArticleHeader, ResourceCta } from "@/components/resources/ResourceArticle";
import { RichText } from "@/components/resources/RichText";
import { STAMP_DECODER_PATH, stampFieldCopy, treatmentCodes } from "@/lib/download-source";
import { getHubPillar } from "@/lib/resources";
import { stampDecoderCopy, type StampResult } from "@/lib/stamp-decoder";

const inputClass =
  "mt-2 block w-full rounded-input border border-brand-green/30 bg-cream px-3 py-2 text-[16px] text-ink focus-visible:border-brand-green focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-green";

const labelClass = "block text-[14px] font-semibold leading-snug text-brand-green";

const textLinkClass =
  "font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

function errorFor(result: StampResult | null, field: StampResult["errors"][number]["field"]) {
  return result?.errors.find((error) => error.field === field);
}

export function StampDecoderPage({ result }: { result: StampResult | null }) {
  const copy = stampDecoderCopy;
  const fields = stampFieldCopy();
  const codes = treatmentCodes();
  const guide = getHubPillar("heat-treated-pallets-ispm-15");
  const guideTitle = guide?.title ?? "Heat-treated pallets";
  const guideHref = guide?.href ?? "/resources/heat-treated-pallets-ispm-15/";
  const input = result?.input ?? { country: "", producer: "", treatment: "", dun: false };
  const countryError = errorFor(result, "country");
  const producerError = errorFor(result, "producer");
  const treatmentError = errorFor(result, "treatment");
  const treatmentValue = codes.some((row) => row.code === input.treatment) ? input.treatment : "";

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources/" },
          { name: guideTitle, path: guideHref },
          { name: copy.heading, path: STAMP_DECODER_PATH },
        ]}
      />
      <WebApplicationJsonLd name={copy.schemaName} description={copy.metaDescription} path={STAMP_DECODER_PATH} />
      <ArticleHeader eyebrow={copy.eyebrow} title={copy.heading} updated={copy.updated} libraryLabel="Resources" crumbs={[{ name: guideTitle, href: guideHref }]} />

      <div className="pb-20 pt-14 nav:pb-28 nav:pt-16">
        <div className={cn(containerClass, "nav:grid nav:grid-cols-12 nav:gap-16")}>
          <div className="prose-measure space-y-4 text-body text-ink/85 nav:col-span-8 nav:col-start-5">
            <p>{copy.intro}</p>
            <p>{copy.exampleNote}</p>

            <figure className="pt-4">
              <div className="flex min-h-[180px] flex-col items-center justify-center border border-dashed border-brand-green/40 px-6 py-10 text-center">
                <p className="text-[14px] font-semibold uppercase tracking-wide text-brand-green">{copy.photo.label}</p>
                <p className="mt-3 max-w-[48ch] text-body text-ink/80">{copy.photo.body}</p>
              </div>
              <figcaption className="mt-3 text-[14px] leading-relaxed text-ink/70">{copy.photo.caption}</figcaption>
            </figure>

            <form method="get" action={`${STAMP_DECODER_PATH}#result`} aria-label={copy.form.label} className="border-t border-brand-green/15 pt-8">
              <div>
                <label htmlFor="cc" className={labelClass}>
                  {copy.form.countryLabel}
                </label>
                <input
                  id="cc"
                  name="cc"
                  defaultValue={input.country}
                  maxLength={12}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={countryError ? true : undefined}
                  aria-describedby={countryError ? "cc-help cc-error" : "cc-help"}
                  className={inputClass}
                />
                <p id="cc-help" className="mt-2 text-[14px] leading-relaxed text-ink/75">
                  <RichText text={fields.country} />
                </p>
                {countryError && (
                  <p id="cc-error" role="alert" className="mt-2 border-l-2 border-brand-green pl-3 text-[14px] font-semibold leading-relaxed text-ink">
                    {countryError.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="producer" className={labelClass}>
                  {copy.form.producerLabel}
                </label>
                <input
                  id="producer"
                  name="producer"
                  defaultValue={input.producer}
                  maxLength={24}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={producerError ? true : undefined}
                  aria-describedby={producerError ? "producer-help producer-error" : "producer-help"}
                  className={inputClass}
                />
                <p id="producer-help" className="mt-2 text-[14px] leading-relaxed text-ink/75">
                  <RichText text={fields.producer} />
                </p>
                {producerError && (
                  <p id="producer-error" role="alert" className="mt-2 border-l-2 border-brand-green pl-3 text-[14px] font-semibold leading-relaxed text-ink">
                    {producerError.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="treatment" className={labelClass}>
                  {copy.form.treatmentLabel}
                </label>
                <select
                  id="treatment"
                  name="treatment"
                  defaultValue={treatmentValue}
                  aria-invalid={treatmentError ? true : undefined}
                  aria-describedby={treatmentError ? "treatment-help treatment-error" : "treatment-help"}
                  className={inputClass}
                >
                  <option value="">{copy.form.treatmentEmpty}</option>
                  {codes.map((row) => (
                    <option key={row.code} value={row.code}>
                      {row.code} — {row.name}
                    </option>
                  ))}
                </select>
                <p id="treatment-help" className="mt-2 text-[14px] leading-relaxed text-ink/75">
                  <RichText text={fields.treatment} />
                </p>
                {treatmentError && (
                  <p id="treatment-error" role="alert" className="mt-2 border-l-2 border-brand-green pl-3 text-[14px] font-semibold leading-relaxed text-ink">
                    {treatmentError.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="dun" className="flex items-start gap-3 text-body text-ink">
                  <input
                    id="dun"
                    name="dun"
                    type="checkbox"
                    value="1"
                    defaultChecked={input.dun}
                    className="mt-1 h-4 w-4 accent-brand-green focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                  />
                  <span>{copy.form.dunLabel}</span>
                </label>
                <p id="dun-help" className="mt-2 text-[14px] leading-relaxed text-ink/75">
                  <RichText text={fields.dun} />
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button type="submit" variant="secondary">
                  {copy.form.submit}
                </Button>
                <Link href={STAMP_DECODER_PATH} prefetch={false} className={textLinkClass}>
                  {copy.form.reset}
                </Link>
              </div>
            </form>

            <section id="result" aria-live="polite" className="scroll-mt-28 border-t border-brand-green/15 pt-8">
              <h2 className="text-display-row text-brand-green">{copy.result.heading}</h2>
              {!result && <p className="mt-4 text-body text-ink/85">{copy.form.idle}</p>}
              {result && !result.ok && <p className="mt-4 text-body text-ink/85">{copy.result.bad}</p>}
              {result?.ok && result.mark && result.treatmentCode && (
                <div className="mt-4 space-y-4 text-body text-ink/85">
                  <p>{copy.result.ok}</p>
                  <div className="max-w-sm border-2 border-brand-green px-4 py-4" aria-label={copy.result.schematicLabel}>
                    <p className="text-[13px] font-semibold uppercase tracking-wide text-eyebrow-ink">IPPC symbol</p>
                    <p className="mt-3 font-display text-step-lg uppercase text-brand-green">{result.mark}</p>
                    <p className="mt-1 text-[13px] text-ink/70">Country code, hyphen, producer number</p>
                    <p className="mt-4 font-display text-step-lg uppercase text-brand-green">{result.treatmentCode}</p>
                    <p className="mt-1 text-[13px] text-ink/70">{result.treatmentName}</p>
                    {result.input.dun && (
                      <>
                        <p className="mt-4 font-display text-step-lg uppercase text-brand-green">DUN</p>
                        <p className="mt-1 text-[13px] text-ink/70">Dunnage</p>
                      </>
                    )}
                  </div>
                  <p className="text-[14px] leading-relaxed text-ink/70">{copy.result.schematicLabel}</p>
                  <p>{copy.result.symbolNote}</p>
                  <p>
                    {result.treatmentCode} is {result.treatmentName}. {result.treatmentInvolves}
                  </p>
                  <p>{result.input.dun ? copy.result.dunOn : copy.result.dunOff}</p>
                  <p>{copy.result.notLookup}</p>
                </div>
              )}
            </section>

            <ul className="space-y-3 border-t border-brand-green/15 pt-8 text-body">
              {copy.related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={textLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ResourceCta heading={ispm.cta.heading} body={ispm.cta.body} source="stamp-decoder" />
    </main>
  );
}
