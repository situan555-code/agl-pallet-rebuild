export function TbdImage({ caption }: { caption: string }) {
  return (
    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-input border border-dashed border-brand-green/30 bg-surface-alt p-6 text-center">
      <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">{caption}</p>
    </div>
  );
}
