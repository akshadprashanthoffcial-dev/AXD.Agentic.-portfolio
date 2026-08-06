import type { Metadata } from "next";
import AxdBlob from "@/components/blob/AxdBlob";
import SuggestionChip from "@/components/ui/SuggestionChip";
import { HOME_SUGGESTIONS } from "@/data/site";

export const metadata: Metadata = {
  title: "Hmm",
  description: "That one stumped the agent.",
};

export default async function OopsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <section className="mx-auto flex min-h-[100svh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
      <AxdBlob size={240} />

      <h1 className="font-display mt-6 text-[clamp(28px,5vw,48px)] leading-tight text-white">
        {q ? (
          <>
            I&apos;ve got nothing on{" "}
            <span className="text-brand">&ldquo;{q}&rdquo;</span>.
          </>
        ) : (
          <>That one stumped me.</>
        )}
      </h1>

      <p className="mt-4 max-w-md text-white/68">
        I&apos;m only trained on Akshad&apos;s work, life and questionable design
        opinions. Ask me about those and I&apos;ll actually be useful.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
        {HOME_SUGGESTIONS.map((s) => (
          <SuggestionChip key={s.href} label={s.label} href={s.href} />
        ))}
      </div>
    </section>
  );
}
