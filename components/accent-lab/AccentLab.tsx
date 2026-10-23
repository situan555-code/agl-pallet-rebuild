"use client";

// Internal Accent Lab. Every exploratory color is applied with inline styles
// from content/brand/accent-lab.json, never with Tailwind classes or CSS, so
// none of it reaches .next/static/css and the Palette 05 color gate
// (scripts/color.js) is unaffected. Do not convert these to bg-[#...] classes.

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import lab from "@/content/brand/accent-lab.json";
import home from "@/content/pages/home.json";
import { bestInk, contrastRatio, formatOklch, normalizeHex } from "@/lib/color-science";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "agl-accent-lab-v1";
const WHITE = "#FFFFFF";

type Shade = { step: number; hex: string };
type Saved = { accent: string; family: string; ground: number };

const scale: Shade[] = lab.green.scale;
const groundSteps: number[] = lab.green.groundSteps;
const copy = lab.copy;

function shade(step: number): Shade {
  return scale.find((s) => s.step === step) ?? scale[0];
}

// Scale runs light (50) to dark (950); "lighter" means an earlier index.
function lighter(step: number, by: number): Shade {
  const i = scale.findIndex((s) => s.step === step);
  return scale[Math.max(i - by, 0)];
}

function readSaved(): Saved {
  const fallback: Saved = {
    accent: lab.defaultAccent.hex,
    family: lab.defaultAccent.family,
    ground: lab.green.coreStep,
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Saved>;
    const accent = typeof parsed.accent === "string" ? normalizeHex(parsed.accent) : null;
    const ground = typeof parsed.ground === "number" && groundSteps.includes(parsed.ground) ? parsed.ground : null;
    if (!accent || ground === null) return fallback;
    return { accent, family: typeof parsed.family === "string" ? parsed.family : copy.customFamily, ground };
  } catch {
    return fallback;
  }
}

function verdict(ratio: number): string {
  if (ratio >= 4.5) return copy.verdictText;
  if (ratio >= 3) return copy.verdictLarge;
  return copy.verdictLow;
}

// No outline-none: in Tailwind 4 it sets outline-style none, which hides the
// focus-visible ring. Same pattern as the site's other focusable controls.
const focusRing =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export default function AccentLab() {
  // Rendered client-only (see AccentLabLoader), so reading storage here is safe.
  const [state, setState] = useState<Saved>(readSaved);
  const [hexDraft, setHexDraft] = useState(state.accent);
  const [status, setStatus] = useState("");
  const statusTimer = useRef<number | undefined>(undefined);

  const update = useCallback((next: Partial<Saved>) => {
    setState((prev) => {
      const merged = { ...prev, ...next };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // Storage can be unavailable (private mode, embedded frames). The lab still works.
      }
      return merged;
    });
    if (next.accent) setHexDraft(next.accent);
  }, []);

  const announce = useCallback((message: string) => {
    setStatus(message);
    window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(""), 2200);
  }, []);

  const copyHex = useCallback(
    async (hex: string) => {
      try {
        await navigator.clipboard.writeText(hex);
        announce(`${copy.copied} ${hex}`);
      } catch {
        announce(`${copy.copyBlocked} ${hex}`);
      }
    },
    [announce],
  );

  const ground = shade(state.ground);
  const card = lighter(state.ground, 1);
  const edge = lighter(state.ground, 2);
  const subInk = shade(100).hex;
  const accent = state.accent;
  const ratio = contrastRatio(accent, ground.hex);
  const onAccent = bestInk(accent, shade(lab.green.coreStep).hex, WHITE);
  const accentAsText = ratio >= 3 ? accent : WHITE;
  const cardLink = contrastRatio(accent, card.hex) >= 4.5 ? accent : WHITE;

  const heroButtons = home.hero.buttons;
  const cards = home.capability.cards;
  const eyebrow = home.partnerSplit.cards[1].eyebrow;

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-36 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 pb-6">
        <h1 className="display text-[clamp(40px,6vw,64px)] leading-[0.95]">{copy.title}</h1>
        <p className="max-w-[520px] text-muted-foreground">{copy.intro}</p>
      </header>

      {/* Preview */}
      <section aria-label={copy.previewLabel} className="overflow-hidden rounded-[20px] border border-border">
        <div
          className="flex flex-wrap items-center justify-between gap-5 px-7 py-[18px]"
          style={{ backgroundColor: shade(lab.green.coreStep).hex }}
        >
          <Image
            src={lab.logo.src}
            alt={lab.logo.alt}
            width={lab.logo.width}
            height={lab.logo.height}
            unoptimized
            className="h-[42px] w-auto"
          />
          <span className="text-xs" style={{ color: shade(300).hex }}>
            {copy.truthNote}
          </span>
        </div>

        <div
          className="px-5 pb-9 pt-8 transition-colors duration-300 motion-reduce:transition-none sm:px-12 sm:pb-11 sm:pt-14"
          style={{ backgroundColor: ground.hex, color: WHITE }}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em]" style={{ color: subInk }}>
            <span aria-hidden style={{ color: accentAsText }}>
              /
            </span>
            &nbsp; {eyebrow}
          </p>
          <h2 className="display mt-3.5 max-w-[15ch] text-[clamp(36px,6.4vw,76px)] uppercase leading-[0.94]">
            {home.hero.heading}
          </h2>
          <p className="mt-[18px] max-w-[60ch] text-lg leading-relaxed" style={{ color: subInk }}>
            {home.hero.body}
          </p>

          <div className="mt-[30px] flex flex-wrap gap-3">
            {heroButtons.map((b, i) =>
              i === 0 ? (
                <span
                  key={b.label}
                  className="inline-flex min-h-[52px] items-center gap-3.5 rounded-full pl-[26px] pr-[7px] text-[17px] font-semibold"
                  style={{ backgroundColor: accent, color: onAccent }}
                >
                  {b.label}
                  <span className="inline-flex size-[38px] items-center justify-center rounded-full bg-current/15">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </span>
              ) : (
                <span
                  key={b.label}
                  className="inline-flex min-h-[52px] items-center rounded-full border-[1.5px] px-[26px] text-[17px] font-semibold"
                  style={{ borderColor: edge.hex, color: WHITE }}
                >
                  {b.label}
                </span>
              ),
            )}
          </div>

          <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 sm:mt-[52px]">
            {cards.map((c) => (
              <article
                key={c.heading}
                className="rounded-[18px] border px-6 pb-[26px] pt-6"
                style={{ backgroundColor: card.hex, borderColor: edge.hex }}
              >
                <span
                  className="mb-3.5 inline-block size-3 rounded-full"
                  aria-hidden
                  style={{ backgroundColor: accent }}
                />
                <h3 className="display text-2xl leading-[1.1]">{c.heading}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed" style={{ color: subInk }}>
                  {c.body}
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold"
                  style={{ color: cardLink }}
                >
                  {heroButtons[0].label}
                  <ArrowRight className="size-[15px]" aria-hidden />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
        <section aria-labelledby="lab-ground" className="rounded-[18px] border border-border bg-card p-5">
          <h2 id="lab-ground" className="text-[17px] font-semibold">
            {copy.groundTitle}
          </h2>
          <p className="mb-3.5 mt-1 text-sm text-muted-foreground">{copy.groundHint}</p>
          <div className="flex flex-wrap gap-2">
            {groundSteps.map((step) => {
              const pressed = step === state.ground;
              return (
                <button
                  key={step}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => update({ ground: step })}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2.5 rounded-full border pl-2 pr-3.5 text-sm font-semibold",
                    pressed ? "border-2 border-foreground" : "border-border",
                    focusRing,
                  )}
                >
                  <span
                    aria-hidden
                    className="size-7 rounded-full ring-1 ring-inset ring-foreground/25"
                    style={{ backgroundColor: shade(step).hex }}
                  />
                  {step === lab.green.coreStep ? `${step} ${copy.coreLabel}` : step}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="lab-accent" className="rounded-[18px] border border-border bg-card p-5">
          <h2 id="lab-accent" className="text-[17px] font-semibold">
            {copy.accentTitle}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div
              aria-hidden
              className="size-[72px] flex-none rounded-[14px] ring-1 ring-inset ring-foreground/25"
              style={{ backgroundColor: accent }}
            />
            <div>
              <p className="display text-[28px] leading-none">{accent}</p>
              <p className="mt-1.5 text-sm tabular-nums text-muted-foreground">
                {state.family} · {formatOklch(accent)}
              </p>
              <p className="mt-1.5 text-sm font-semibold tabular-nums">
                {ratio.toFixed(1)} : 1 on {state.ground} · {verdict(ratio)}
              </p>
            </div>
          </div>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => copyHex(accent)}
              className={cn("min-h-11 rounded-full border border-border px-4 text-sm font-semibold", focusRing)}
            >
              {copy.copyHex}
            </button>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold">
              {copy.custom}
              <input
                type="color"
                value={accent.toLowerCase()}
                onChange={(e) => update({ accent: e.target.value.toUpperCase(), family: copy.customFamily })}
                className="size-[26px] cursor-pointer border-0 bg-transparent p-0"
              />
            </label>
            <label htmlFor="lab-hex" className="sr-only">
              {copy.hexLabel}
            </label>
            <input
              id="lab-hex"
              value={hexDraft}
              maxLength={7}
              spellCheck={false}
              placeholder={copy.hexPlaceholder}
              onChange={(e) => setHexDraft(e.target.value)}
              onBlur={() => {
                const next = normalizeHex(hexDraft);
                if (next) update({ accent: next, family: copy.customFamily });
                else announce(copy.hexError);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="min-h-11 w-[120px] rounded-[10px] border border-border bg-transparent px-3 text-sm tabular-nums"
            />
            <span role="status" aria-live="polite" className="text-[13px] text-muted-foreground">
              {status}
            </span>
          </div>
        </section>
      </div>

      {/* Shade scale */}
      <section aria-labelledby="lab-scale" className="mt-12">
        <h2 id="lab-scale" className="display text-[clamp(28px,3.4vw,40px)] leading-none">
          {copy.scaleTitle}
        </h2>
        <p className="mt-2.5 max-w-[70ch] text-muted-foreground">{copy.scaleIntro}</p>
        <div className="mt-5 grid grid-cols-6 gap-1.5 md:grid-cols-11">
          {scale.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => copyHex(s.hex)}
              aria-label={`${copy.copyHex} ${s.step} ${s.hex}`}
              className={cn("text-left", focusRing)}
            >
              <span
                className="block h-[72px] rounded-[10px] ring-1 ring-inset ring-foreground/20"
                style={{ backgroundColor: s.hex }}
              />
              <span className="mt-2 block text-xs font-semibold tabular-nums">{s.step}</span>
              <span className="block text-xs tabular-nums text-muted-foreground">{s.hex}</span>
              {s.step === lab.green.coreStep ? (
                <span className="block text-[11px] font-bold uppercase tracking-wider">{copy.coreLabel}</span>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      {/* Library */}
      <section aria-labelledby="lab-library" className="mt-12">
        <h2 id="lab-library" className="display text-[clamp(28px,3.4vw,40px)] leading-none">
          {copy.libraryTitle}
        </h2>
        <p className="mt-2.5 max-w-[70ch] text-muted-foreground">{copy.libraryIntro}</p>
        {lab.families.map((fam) => (
          <div
            key={fam.name}
            className="mt-5 grid gap-x-6 gap-y-3 border-t border-border pt-[18px] md:grid-cols-[240px_minmax(0,1fr)]"
          >
            <div>
              <h3 className="text-[17px] font-semibold">{fam.name}</h3>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{fam.desc}</p>
            </div>
            <div className="grid grid-cols-4 gap-2.5 md:grid-cols-8">
              {fam.swatches.map((hex) => {
                const pressed = hex === accent;
                return (
                  <button
                    key={hex}
                    type="button"
                    aria-pressed={pressed}
                    aria-label={`${fam.name} ${hex}`}
                    onClick={() => update({ accent: hex, family: fam.name })}
                    className={cn("text-left", focusRing)}
                  >
                    <span
                      className={cn(
                        "block h-[54px] rounded-[10px]",
                        pressed && "ring-[3px] ring-foreground ring-offset-[3px] ring-offset-background",
                      )}
                      style={{ backgroundColor: hex }}
                    />
                    <span className="mt-2 flex justify-between gap-1.5 text-xs tabular-nums">
                      <span className="font-semibold">{hex}</span>
                      <span className="text-muted-foreground">{contrastRatio(hex, ground.hex).toFixed(1)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
