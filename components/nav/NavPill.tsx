"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AxdBlob from "@/components/blob/AxdBlob";
import { suggest, route } from "@/lib/search";

function Magnifier({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

/**
 * Persistent top-nav search (non-home pages). Minimized it's the blob + "AXD".
 * Hover expands it inline into a transparent search bar; focus/click reveals
 * an inline dropdown with premade suggestions. No modal, no page blur.
 */
export default function NavPill() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const expanded = hovered || focused;
  const list = useMemo(() => suggest(q, 5), [q]);
  const open = focused; // show dropdown (with defaults) whenever focused

  useEffect(() => {
    setQ("");
    setFocused(false);
    setHovered(false);
  }, [pathname]);
  useEffect(() => setActive(-1), [q]);

  if (pathname === "/") return null;

  const go = (href?: string) => router.push(href ?? route(q));
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
    <div className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Gradient border → transparent black fill; width animates on expand */}
        <div
          className="rounded-full p-px transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ background: "var(--brand-gradient)", width: expanded ? 440 : 128 }}
          onClick={() => inputRef.current?.focus()}
        >
          <div
            className="flex h-12 items-center gap-2 rounded-full pl-1.5 pr-4"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.9)), var(--brand-sheen-soft)",
            }}
          >
            <Link
              href="/"
              aria-label="Back to home"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded-full transition-transform duration-300 hover:scale-110"
            >
              <AxdBlob size={36} interactive={false} mode="nav" />
            </Link>
            {expanded ? (
              <>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 160)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask me anything…"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/50 outline-none"
                  aria-label="Ask the axd.labs agent"
                />
                <span className="text-white/55">
                  <Magnifier />
                </span>
              </>
            ) : (
              <span className="font-display flex-1 text-sm font-semibold tracking-wide text-white">
                AXD
              </span>
            )}
          </div>
        </div>

        {/* Inline dropdown — dark translucent, premade suggestions */}
        {open && list.length > 0 && (
          <ul
            className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-white/10 p-1.5 backdrop-blur-xl"
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
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                    active === i ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-[15px] text-white/90">{s.label}</span>
                  {s.hint && (
                    <span className="text-[12px] uppercase tracking-wide text-white/45">
                      {s.hint}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
