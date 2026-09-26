export function TbdImage({ caption }: { caption: string }) {
  return (
    <div className="flex aspect-4/3 w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-gray/40 bg-smoke/40 p-6 text-center">
      <p className="text-eyebrow font-semibold uppercase tracking-wide text-gray">{caption}</p>
    </div>
  );
}
