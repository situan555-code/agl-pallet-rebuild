export function EmbeddedVideo({
  src,
  controls,
  autoPlay,
  muted,
  loop,
}: {
  src: string;
  controls: boolean;
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
}) {
  return (
    <section className="relative bg-surface px-6 py-[85px]">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-surface-alt" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1000px]">
        <video
          src={src}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          className="w-full"
        />
      </div>
    </section>
  );
}
