"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import GameCanvas, { type Hud } from "./GameCanvas";
import Certificate from "./Certificate";
import PixelWipe from "./PixelWipe";
import PixelBlob from "./PixelBlob";
import SoundControls from "./SoundControls";
import { GameAudio } from "./engine/audio";
import { LEVELS } from "./engine/maze";
import type { GameState } from "./engine/game";

type Screen = "intro" | "playing" | "lost" | "cleared" | "certificate";

const EMPTY_HUD: Hud = { saved: 0, automated: 0, left: 0, powers: [], ready: 0 };

export default function EatJobs() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [hud, setHud] = useState<Hud>(EMPTY_HUD);
  const [lastRound, setLastRound] = useState({ saved: 0, automated: 0, total: 0 });
  const [wiping, setWiping] = useState(true);
  // Totals across the whole run, for the certificate.
  const run = useRef({ saved: 0, total: 0, seconds: 0 });
  const audio = useRef<GameAudio>(null as unknown as GameAudio);
  if (!audio.current) audio.current = new GameAudio();

  const level = LEVELS[levelIndex];

  // The jingle on arrival. The click that opened the egg counted as user
  // activation for this document, so the context is allowed to start; if
  // someone lands here by URL instead, the first tap or key starts it.
  useEffect(() => {
    const a = audio.current;
    // Starts under the pixel wipe, so the music covers the transition.
    a.intro();

    const kick = () => {
      a.ensure();
      a.intro();
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);

    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      a.quiet();
    };
  }, []);

  const onHud = useCallback((next: Hud) => setHud(next), []);

  const onEnd = useCallback((outcome: "won" | "lost", state: GameState) => {
    setLastRound({
      saved: state.saved,
      automated: state.automated,
      total: state.pelletsTotal,
    });
    if (outcome === "lost") {
      audio.current.lose();
      setScreen("lost");
      return;
    }
    run.current.saved += state.saved;
    run.current.total += state.pelletsTotal;
    run.current.seconds += state.time;
    const isFinal = state.levelIndex >= LEVELS.length - 1;
    if (isFinal) audio.current.win();
    else audio.current.roundClear();
    setScreen(isFinal ? "certificate" : "cleared");
  }, []);

  const play = () => {
    audio.current.ensure();
    setAttempt((n) => n + 1);
    setHud(EMPTY_HUD);
    setScreen("playing");
  };

  const startRun = () => {
    run.current = { saved: 0, total: 0, seconds: 0 };
    setLevelIndex(0);
    play();
  };

  const nextRound = () => {
    setLevelIndex((n) => n + 1);
    play();
  };

  return (
    <div className="eatjobs">
      {wiping && <PixelWipe mode="reveal" onDone={() => setWiping(false)} />}

      <div className="eatjobs-cabinet">
        <div className="eatjobs-marquee">
          <span className="eatjobs-logo">EAT.JOBS</span>
          <span className="eatjobs-level">
            Round {levelIndex + 1} of {LEVELS.length} — {level.label}
          </span>
          <SoundControls audio={audio.current} />
        </div>

        <div className="eatjobs-scoreline">
          {screen === "playing" ? (
            <>
              <span className="eatjobs-count eatjobs-count-you">
                You <b>{hud.saved}</b>
              </span>
              <span className="eatjobs-bar" aria-hidden>
                <i
                  className="eatjobs-bar-you"
                  style={{
                    width: `${
                      hud.saved + hud.automated
                        ? (hud.saved / (hud.saved + hud.automated)) * 100
                        : 50
                    }%`,
                  }}
                />
              </span>
              <span className="eatjobs-count eatjobs-count-ai">
                <b>{hud.automated}</b> AI
              </span>
            </>
          ) : (
            <span className="eatjobs-count eatjobs-count-idle">
              Insert coin. No coin required.
            </span>
          )}
        </div>

        {/* The taller box is only wanted when a panel is in it; while playing
            it would just letterbox the maze into a strip. */}
        <div className={`eatjobs-stage ${screen === "playing" ? "" : "has-panel"}`}>
          {screen === "playing" && (
            <GameCanvas
              key={`${levelIndex}-${attempt}`}
              levelIndex={levelIndex}
              attempt={attempt}
              audio={audio.current}
              onHud={onHud}
              onEnd={onEnd}
            />
          )}

          {screen === "intro" && (
            <div className="eatjobs-overlay">
              <div className="eatjobs-panel">
                <p className="eatjobs-kicker">Now in general availability</p>
                <h1 className="eatjobs-title">EAT.JOBS</h1>
                <p className="eatjobs-tagline">
                  An AI-first solution for headcount reduction.
                </p>

                <div className="eatjobs-legend">
                  <span>
                    <i className="eatjobs-chip eatjobs-chip-blob">
                      <PixelBlob size={20} />
                    </i>
                    You
                  </span>
                  <span>
                    <i className="eatjobs-chip eatjobs-chip-job" />
                    Jobs — eat them
                  </span>
                  <span>
                    <i className="eatjobs-chip eatjobs-chip-ai">AI</i>
                    Wants them first
                  </span>
                  <span>
                    <i className="eatjobs-chip eatjobs-chip-power">?</i>
                    Power-ups
                  </span>
                </div>

                <p className="eatjobs-body">
                  Those little briefcases scattered through the maze are jobs.
                  AI is coming for them. Take more than half and you keep your
                  role for another round — there are three, and AI gets faster
                  in each one.
                </p>
                <p className="eatjobs-keys">
                  <b>Arrows</b> or <b>WASD</b> to move, <b>swipe</b> on a phone
                </p>

                <div className="eatjobs-actions">
                  <button type="button" className="eatjobs-btn" onClick={startRun}>
                    Start
                  </button>
                  <Link href="/" className="eatjobs-btn eatjobs-btn-quiet">
                    Back to axd.labs
                  </Link>
                </div>
              </div>
            </div>
          )}

          {screen === "lost" && (
            <div className="eatjobs-overlay">
              <div className="pixel-frame eatjobs-card">
                <div className="pixel-frame-in">
                  <div className="eatjobs-card-bar">
                    <span>Internal memo</span>
                    <span aria-hidden>× □</span>
                  </div>
                  <h2 className="eatjobs-card-title">
                    Your position has been automated.
                  </h2>
                  <p className="eatjobs-body">
                    Following a strategic review, AI took {lastRound.automated} of
                    the {lastRound.total} jobs on the board. You held{" "}
                    {lastRound.saved}. We thank you for your contributions.
                  </p>
                  <RoundBar saved={lastRound.saved} automated={lastRound.automated} />
                  <div className="eatjobs-actions">
                    <button type="button" className="eatjobs-btn" onClick={play}>
                      Appeal the decision
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {screen === "cleared" && (
            <div className="eatjobs-overlay">
              <div className="pixel-frame eatjobs-card">
                <div className="pixel-frame-in">
                  <div className="eatjobs-card-bar">
                    <span>Round {levelIndex + 1} cleared</span>
                    <span aria-hidden>× □</span>
                  </div>
                  <h2 className="eatjobs-card-title">
                    You survived the pilot. So they&apos;re expanding the pilot.
                  </h2>
                  <p className="eatjobs-body">
                    You held {lastRound.saved} of {lastRound.total} jobs. Next up:{" "}
                    {LEVELS[levelIndex + 1]?.label.toLowerCase()}. AI has been
                    given a faster machine.
                  </p>
                  <RoundBar saved={lastRound.saved} automated={lastRound.automated} />
                  <div className="eatjobs-actions">
                    <button type="button" className="eatjobs-btn" onClick={nextRound}>
                      Next round
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {screen === "certificate" && (
            <Certificate
              saved={run.current.saved}
              total={run.current.total}
              seconds={run.current.seconds}
              onReplay={startRun}
            />
          )}
        </div>

        <footer className="eatjobs-footer">
          <span className="eatjobs-power-strip">
            {screen === "playing" && hud.powers.length
              ? hud.powers.map((p) => (
                  <span key={p.type} className="eatjobs-power">
                    <i>{p.glyph}</i>
                    {p.blurb} <b>{p.left.toFixed(1)}s</b>
                  </span>
                ))
              : screen === "playing" && (
                  <span className="eatjobs-power eatjobs-power-idle">
                    {hud.left} jobs still on the board
                  </span>
                )}
          </span>
          {/* The certificate carries its own way out, so no second one here. */}
          {screen !== "certificate" && (
            <Link href="/" className="eatjobs-exit">
              ← Back to axd.labs
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}

/** Who ended up with the jobs, as one bar. */
function RoundBar({ saved, automated }: { saved: number; automated: number }) {
  const total = saved + automated || 1;
  return (
    <div className="eatjobs-round-bar">
      <span className="eatjobs-round-you" style={{ width: `${(saved / total) * 100}%` }}>
        {saved}
      </span>
      <span
        className="eatjobs-round-ai"
        style={{ width: `${(automated / total) * 100}%` }}
      >
        {automated}
      </span>
    </div>
  );
}
