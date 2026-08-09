import AxdBlob from "@/components/blob/AxdBlob";
import AgentConsole from "@/components/search/AgentConsole";
import SuggestionChip from "@/components/ui/SuggestionChip";
import Typewriter from "@/components/ui/Typewriter";
import { HERO_PHRASES, HOME_SUGGESTIONS } from "@/data/site";

export default function Home() {
  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-4 py-16">
      <div className="relative flex h-[240px] w-[240px] items-center justify-center">
        {/* Tap it three times quickly. */}
        <AxdBlob size={240} secret />
      </div>

      <h1 className="font-display mt-2 min-h-[2.2em] text-center text-[clamp(30px,5vw,48px)] font-medium leading-[1.1] tracking-tight text-white">
        <Typewriter phrases={HERO_PHRASES} />
      </h1>

      {/* The console owns the bar, the answer thread, and the follow-ups. */}
      <div className="relative z-20 mt-8 w-full max-w-[640px]">
        <AgentConsole />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {HOME_SUGGESTIONS.map((s) => (
          <SuggestionChip key={s.href} label={s.label} href={s.href} icon={s.icon} />
        ))}
      </div>
    </section>
  );
}
