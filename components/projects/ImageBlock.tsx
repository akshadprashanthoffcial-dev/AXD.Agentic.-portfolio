import Image from "next/image";

type Props = {
  src?: string;
  caption?: string;
  ratio?: number; // width / height
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** A project image, or a labelled grey placeholder box when no asset exists. */
export default function ImageBlock({
  src,
  caption,
  ratio = 16 / 10,
  className = "",
  sizes = "(max-width: 900px) 100vw, 900px",
  priority = false,
}: Props) {
  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/10"
        style={{ aspectRatio: String(ratio) }}
      >
        {src ? (
          <Image
            src={src}
            alt={caption ?? ""}
            fill
            sizes={sizes}
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 0%, rgba(161,31,242,0.10), rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.015))",
            }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-white/20">
              image coming soon
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-sm text-white/40">{caption}</figcaption>
      )}
    </figure>
  );
}
