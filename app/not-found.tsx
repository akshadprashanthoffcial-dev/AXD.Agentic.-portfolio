import Link from "next/link";
import AxdBlob from "@/components/blob/AxdBlob";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[100svh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <AxdBlob size={220} />
      <h1 className="font-display mt-6 text-[clamp(28px,5vw,48px)] text-white">
        This page wandered off.
      </h1>
      <p className="mt-4 text-white/68">Even the agent can&apos;t find it.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-transform duration-300 hover:scale-[1.03]"
        style={{ background: "var(--brand-gradient)" }}
      >
        Back home
      </Link>
    </section>
  );
}
