export function PageHero({
  eyebrow,
  heading,
  body,
}: {
  eyebrow: string;
  heading: string;
  body: string;
}) {
  return (
    <section className="bg-brand-green px-6 pb-16 pt-[152px] text-center text-white">
      <div className="mx-auto max-w-[800px]">
        <p className="text-eyebrow font-semibold uppercase tracking-wide">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
        <h1 className="mt-4 text-display-1">{heading}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-body">{body}</p>
      </div>
    </section>
  );
}
