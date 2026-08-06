"use client";

// ============================================================
// The home search bar, upgraded from a router into a console.
// Typing still surfaces page matches; pressing Enter now gets an
// actual answer from lib/agent.ts, appended to a short thread.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ask, OPENING_REPLY, type AgentReply } from "@/lib/agent";
import { suggest } from "@/lib/search";
import AxdBlob from "@/components/blob/AxdBlob";
import Sparkles from "@/components/ui/Sparkles";

type Turn = { q: string; reply: AgentReply };

/** Long enough to read as consideration, short enough not to annoy. */
const THINK_MS = 480;
const MAX_TURNS = 8;

function Magnifier({ size = 22 }: { size?: number }) {
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

export default function AgentConsole() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [thinking, setThinking] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  const list = useMemo(() => suggest(q, 5), [q]);
  const showList = focused && q.trim().length > 0 && turns.length === 0 && !thinking;

  useEffect(() => setActive(-1), [q]);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  // Keep the newest answer in view as the thread grows.
  useEffect(() => {
    if (!turns.length && !thinking) return;
    threadRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [turns.length, thinking]);

  const send = useCallback((text: string) => {
    const query = text.trim();
    if (!query) return;
    setQ("");
    setActive(-1);
    setThinking(query);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setThinking(null);
      setTurns((t) => [...t, { q: query, reply: ask(query) }].slice(-MAX_TURNS));
    }, THINK_MS);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && showList) {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, list.length - 1));
    } else if (e.key === "ArrowUp" && showList) {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      // An arrowed-to suggestion is an explicit "take me there".
      if (showList && active >= 0) router.push(list[active].href);
      else send(q);
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  const started = turns.length > 0 || thinking !== null;

  return (
    <div className="w-full">
      {/* ---------------- The bar ---------------- */}
      <div className="relative w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-[36px] opacity-70 blur-[14px]"
          style={{ background: "var(--brand-sheen)" }}
        />

        <div className="relative rounded-[32px] p-px" style={{ background: "var(--brand-gradient)" }}>
          <div
            className="flex h-16 items-center gap-3 rounded-[31px] px-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.9)), var(--brand-sheen-soft)",
              boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
            }}
          >
            <span className="text-white/72">
              <Magnifier />
            </span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 140)}
              onKeyDown={onKeyDown}
              placeholder="Ask about the work, the experience, or hiring"
              className="min-w-0 flex-1 bg-transparent text-[18px] text-white placeholder:text-white/55 outline-none"
              aria-label="Ask about Akshad's work"
              autoComplete="off"
              enterKeyHint="send"
            />
            {q.trim() && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => send(q)}
                aria-label="Ask"
                className="shrink-0 rounded-full px-4 py-2 text-[13px] font-medium text-white transition-transform duration-300 hover:scale-105"
                style={{ background: "var(--brand-gradient)" }}
              >
                Ask
              </button>
            )}
          </div>
        </div>

        {/* Page matches while typing, before any conversation starts */}
        {showList && list.length > 0 && (
          <ul
            className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-[24px] border border-white/10 p-1.5 backdrop-blur-xl"
            style={{
              background: "linear-gradient(180deg, rgba(18,12,22,0.94), rgba(10,8,14,0.94))",
              boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            }}
          >
            {list.map((s, i) => (
              <li key={s.href + i}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => router.push(s.href)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                    active === i ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-[16px] text-white/90">{s.label}</span>
                  {s.hint && (
                    <span className="text-[13px] uppercase tracking-wide text-white/60">
                      {s.hint}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------------- The thread ---------------- */}
      {started && (
        <div className="mt-8 flex flex-col gap-7 text-left">
          {turns.map((t, i) => (
            <Exchange key={i} turn={t} onChip={send} />
          ))}

          {thinking && (
            <div>
              <Question text={thinking} />
              <div className="mt-3 flex items-center gap-3 pl-1">
                <AxdBlob size={30} mode="nav" interactive={false} />
                <span className="agent-dots text-white/60" aria-live="polite">
                  <i />
                  <i />
                  <i />
                  <span className="sr-only">Thinking</span>
                </span>
              </div>
            </div>
          )}
          <div ref={threadRef} />
        </div>
      )}
    </div>
  );
}

function Question({ text }: { text: string }) {
  return (
    <p className="flex justify-end">
      <span className="max-w-[85%] rounded-2xl rounded-br-md border border-white/12 px-4 py-2.5 text-[15px] text-white/90">
        {text}
      </span>
    </p>
  );
}

function Exchange({ turn, onChip }: { turn: Turn; onChip: (q: string) => void }) {
  const { q, reply } = turn;
  return (
    <div data-intent={reply.id} data-tier={reply.tier}>
      <Question text={q} />

      <div className="agent-answer mt-3 flex gap-3">
        <span className="mt-0.5 shrink-0">
          <AxdBlob size={30} mode="nav" interactive={false} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] leading-relaxed text-white/85">{reply.text}</p>

          {reply.actions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {reply.actions.map((a) =>
                a.external ? (
                  <a
                    key={a.href}
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="agent-action"
                    style={{ background: "var(--brand-sheen)" }}
                  >
                    <Sparkles size={13} tone="white" />
                    {a.label}
                    <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="agent-action"
                    style={{ background: "var(--brand-sheen)" }}
                  >
                    <Sparkles size={13} tone="white" />
                    {a.label}
                    <span aria-hidden>→</span>
                  </Link>
                )
              )}
            </div>
          )}

          {reply.chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {reply.chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChip(c)}
                  className="rounded-full border border-white/12 px-3.5 py-1.5 text-[13px] text-white/68 transition-colors duration-300 hover:border-white/30 hover:text-white"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { OPENING_REPLY };
