# AGL Pallet stock grade recipe (prototype)

Site vibe targets: cream `#FFFDF7`, paper `#F7F6F2`, forest `#162619`.

Goal: warehouse/yard photos sit quietly on cream cards — slight warmth, gentle contrast, mild desaturation — without flattening intentional shadow drama.

## Design principles

1. **Do not** run global `-normalize` / `-auto-level` on every frame (flattens intentional deep shadows in mill stacks, crate recesses, truck shadow lines).
2. **Gated luminance lift only** when a frame is accidentally too dark (mean below thresholds). Mid/bright frames skip exposure normalize.
3. Bright outdoor frames (`mean > 0.58`) get a soft highlight guard instead of a lift.
4. Always apply the cream/forest vibe ops after the gate.
5. Preserve embedded EXIF/XMP (Creator/Artist `AGL Pallet`, Copyright `© AGL Pallet`, Description). Do **not** `-strip`.

## Exact magick ops (vibe stage — all frames)

```bash
magick INPUT.webp \
  -sigmoidal-contrast 2.0x52% \
  -channel R -evaluate Multiply 1.028 \
  -channel G -evaluate Multiply 1.008 \
  -channel B -evaluate Multiply 0.972 \
  +channel \
  -modulate 101,88,100 \
  -define webp:method=6 -quality 82 \
  OUTPUT.webp
```

| Op | Intent |
|----|--------|
| `-sigmoidal-contrast 2.0x52%` | Gentle S-curve; center slightly above mid so shadows open a hair without crushing blacks |
| R×1.028 / G×1.008 / B×0.972 | Slight cream warmth (pulls toward paper/cream, away from cool industrial blue) |
| `-modulate 101,88,100` | +1% brightness, sat→88% (mild desat), hue unchanged |
| `webp method=6 q82` | Matches stock encode style; keeps file size in band |

## Gated exposure normalize (before vibe)

Measure once:

```bash
MEAN=$(identify -format '%[fx:mean]' INPUT.webp)
```

| Condition | Pre-vibe op | When |
|-----------|-------------|------|
| `mean < 0.28` | `-gamma 1.16` | Crushed / accidental underexposure |
| `0.28 ≤ mean < 0.36` | `-gamma 1.08` | Mild underexposure; keeps deep blacks |
| `0.36 ≤ mean ≤ 0.58` | *(none)* | Mid / intentional drama — **preserve** |
| `mean > 0.58` | `-gamma 0.97` | Bright outdoor — soft highlight guard |

**Never** use `-normalize` or `-auto-level` in this pipeline.

## One-liner template (gated)

```bash
SRC="input.webp"
DST="output.webp"
MEAN=$(identify -format '%[fx:mean]' "$SRC")
GATE=()
awk -v m="$MEAN" 'BEGIN{exit !(m<0.28)}' && GATE=(-gamma 1.16)
awk -v m="$MEAN" 'BEGIN{exit !(m>=0.28 && m<0.36)}' && GATE=(-gamma 1.08)
awk -v m="$MEAN" 'BEGIN{exit !(m>0.58)}' && GATE=(-gamma 0.97)

magick "$SRC" "${GATE[@]}" \
  -sigmoidal-contrast 2.0x52% \
  -channel R -evaluate Multiply 1.028 \
  -channel G -evaluate Multiply 1.008 \
  -channel B -evaluate Multiply 0.972 \
  +channel \
  -modulate 101,88,100 \
  -define webp:method=6 -quality 82 \
  "$DST"
```

Reusable script: `/workspace/agl-polish/grade-batch.sh`

## Prototype test set (2026-10-06)

Samples from `https://nx7k-lab-m4.vercel.app/assets/stock/` (+ local founder copy). Outputs in `/workspace/agl-polish/grade-test/` as `__before.webp` / `__graded.webp`.

| File | mean in → out | Gate | Bytes before → graded | Notes |
|------|---------------|------|------------------------|-------|
| `agl-brock-founder-01_82f1` | 0.569 → 0.574 | none | 203112 → 173312 | Bright outdoor; warmth + mild desat only; no blowout |
| `agl-filler-pallet-yard-01_a162` | 0.555 → 0.563 | none | 328692 → 322902 | High-contrast yard; sits quieter on cream |
| `agl-mill-lumber-01_0b74` | 0.323 → 0.344 | mild γ1.08 | 315952 → 315708 | Intentional drama kept; only soft open |
| `agl-carriers-02_7e71` | 0.466 → 0.467 | none | 296068 → 296036 | Aerial lot; shadow lines preserved |
| `agl-crates-01_4b0f` (extra) | 0.414 → 0.416 | none | 565832 → 572144 | Mid-dark crate drama untouched by lift |

Metadata check on graded: EXIF Artist `AGL Pallet`, Copyright `© AGL Pallet`, ImageDescription preserved; XMP profile size unchanged.

Side-by-side previews: `grade-test/thumbs/*__pair.jpg`.

## Visual judgment

- **Strength:** About right for cream-card sit — not punchy, not flat.
- Warmth: slight (readable next to `#FFFDF7` / `#F7F6F2`); not amber.
- Desat 88%: enough to quiet blue/red industrial accents; wood still reads.
- Mill/crates: deep recesses remain; mild gate on mill only (+~0.02 mean) — good.
- Founder: no highlight guard triggered (mean 0.57 < 0.58); still fine. If a set runs hotter, guard kicks in.

If a full-site pass feels **too warm**, drop R multiply to `1.020` and B to `0.980`.  
If **too flat**, raise sigmoidal to `2.4x50%` (keep gate as-is).  
If **too strong**, sat `90–92` and sigmoidal `1.6x52%`.

## Suggested final params for full batch

Use the gated pipeline above unchanged:

- Gate thresholds: `0.28` / `0.36` / `0.58`
- Vibe: sigmoidal `2.0x52%`, RGB `1.028 / 1.008 / 0.972`, modulate `101,88,100`
- Encode: `-define webp:method=6 -quality 82`
- No `-strip`; verify Artist/Copyright/Description after first 3 files
- Spot-check any frame with `mean < 0.30` or `mean > 0.60` before committing the set
- Prototype only — do not push to git from this workspace

## Out of scope

- No git commits/pushes
- No replacement of live `/assets/stock/` (this folder is a grading lab only)
