"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { suggest, route } from "@/lib/search";

function Magnifier({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

type Props = {
  autoFocus?: boolean;
  onNavigate?: () => void;
};

/** The home hero search — gradient-bordered liquid-glass bar with a
 *  frosted suggestion dropdown. */
export default function SearchBar({ autoFocus = false, onNavigate }: Props) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => suggest(q, 5), [q]);
  const showList = focused && q.trim().length > 0;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);
  useEffect(() => setActive(-1), [q]);

  const go = (href?: string) => {
    const target = href ?? route(q);
    onNavigate?.();
    router.push(target);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active >= 0 ? list[active].href : undefined);
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full">
      {/* Glow behind the bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-[36px] opacity-70 blur-[14px]"
        style={{ background: "var(--brand-sheen)" }}
      />

      {/* Gradient border → transparent black fill (v1 look) */}
      <div
        className="relative rounded-[32px] p-px"
        style={{ background: "var(--brand-gradient)" }}
      >
        <div
          className="flex h-16 items-center gap-3 rounded-[31px] px-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.9)), var(--brand-sheen-soft)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
          }}
        >
          <span className="text-white/60">
            <Magnifier size={22} />
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 140)}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything…"
            className="min-w-0 flex-1 bg-transparent text-[18px] text-white placeholder:text-white/50 outline-none"
            aria-label="Ask the axd.labs agent"
          />
        </div>
      </div>

      {/* Suggestions dropdown — dark translucent */}
      {showList && list.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-[24px] border border-white/10 p-1.5 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,12,22,0.94), rgba(10,8,14,0.94))",
            boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          }}
        >
          {list.map((s, i) => (
            <li key={s.href + i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(s.href)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                  active === i ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="text-[16px] text-white/90">{s.label}</span>
                {s.hint && (
                  <span className="text-[13px] uppercase tracking-wide text-white/45">
                    {s.hint}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
