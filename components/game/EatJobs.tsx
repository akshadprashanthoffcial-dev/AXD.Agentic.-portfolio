"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import GameCanvas, { type Hud } from "./GameCanvas";
import Certificate from "./Certificate";
import { LEVELS } from "./engine/maze";
import type { GameState } from "./engine/game";

type Screen = "intro" | "playing" | "lost" | "cleared" | "certificate";

const EMPTY_HUD: Hud = { saved: 0, automated: 0, left: 0, power: null, ready: 0 };

export default function EatJobs() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [hud, setHud] = useState<Hud>(EMPTY_HUD);
  const [lastRound, setLastRound] = useState({ saved: 0, automated: 0 });
  // Totals across the whole run, for the certificate.
  const run = useRef({ saved: 0, total: 0, seconds: 0 });

  const level = LEVELS[levelIndex];

  const onHud = useCallback((next: Hud) => setHud(next), []);

  const onEnd = useCallback(
    (outcome: "won" | "lost", state: GameState) => {
      setLastRound({ saved: state.saved, automated: state.automated });
      if (outcome === "lost") {
        setScreen("lost");
        return;
      }
      run.current.saved += state.saved;
      run.current.total += state.pelletsTotal;
      run.current.seconds += state.time;
      setScreen(state.levelIndex >= LEVELS.length - 1 ? "certificate" : "cleared");
    },
    []
  );

  const startRun = () => {
    run.current = { saved: 0, total: 0, seconds: 0 };
    setLevelIndex(0);
    setAttempt((n) => n + 1);
    setHud(EMPTY_HUD);
    setScreen("playing");
  };

  const retryRound = () => {
    setAttempt((n) => n + 1);
    setHud(EMPTY_HUD);
    setScreen("playing");
  };

  const nextRound = () => {
    setLevelIndex((n) => n + 1);
    setAttempt((n) => n + 1);
    setHud(EMPTY_HUD);
    setScreen("playing");
  };

  return (
    <div className="eatjobs">
      <div className="eatjobs-cabinet">
        <header className="eatjobs-hud">
          <div className="eatjobs-hud-left">
            <span className="eatjobs-logo">EAT.JOBS</span>
            <span className="eatjobs-level">
              Round {levelIndex + 1} — {level.label}
            </span>
          </div>
          {screen === "playing" && (
            <div className="eatjobs-hud-right">
              <span className="eatjobs-count eatjobs-count-you">
                Jobs saved <b>{hud.saved}</b>
              </span>
              <span className="eatjobs-count eatjobs-count-ai">
                Automated <b>{hud.automated}</b>
              </span>
            </div>
          )}
        </header>

        <div className="eatjobs-stage">
          {screen === "playing" && (
            <GameCanvas
              key={`${levelIndex}-${attempt}`}
              levelIndex={levelIndex}
              attempt={attempt}
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
                <p className="eatjobs-body">
                  You are the blob. Eat the jobs before AI does. Take more than
                  half of them and you keep your role for another round. There
                  are three rounds, and AI gets faster in each one.
                </p>
                <ul className="eatjobs-keys">
                  <li>
                    <b>Arrows</b> or <b>WASD</b> to move
                  </li>
                  <li>
                    <b>Swipe</b>&nbsp;on the maze if you&apos;re on a phone
                  </li>
                  <li>Grab the orange squares. They help.</li>
                </ul>
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
              <div className="eatjobs-panel eatjobs-memo">
                <p className="eatjobs-kicker">Internal memo — do not forward</p>
                <h2 className="eatjobs-memo-title">
                  Following a strategic review, your position has been automated.
                </h2>
                <p className="eatjobs-body">
                  You saved {lastRound.saved} jobs. AI took {lastRound.automated}.
                  We thank you for your contributions and wish you every success
                  in your next chapter.
                </p>
                <div className="eatjobs-actions">
                  <button type="button" className="eatjobs-btn" onClick={retryRound}>
                    Appeal the decision
                  </button>
                  <Link href="/" className="eatjobs-btn eatjobs-btn-quiet">
                    Back to axd.labs
                  </Link>
                </div>
              </div>
            </div>
          )}

          {screen === "cleared" && (
            <div className="eatjobs-overlay">
              <div className="eatjobs-panel">
                <p className="eatjobs-kicker">Round {levelIndex + 1} cleared</p>
                <h2 className="eatjobs-memo-title">
                  You survived the pilot. Leadership was thrilled, so
                  they&apos;re expanding the pilot.
                </h2>
                <p className="eatjobs-body">
                  {lastRound.saved} jobs saved, {lastRound.automated} automated.
                  Next round: {LEVELS[levelIndex + 1]?.label.toLowerCase()}. AI
                  has been given a faster machine.
                </p>
                <div className="eatjobs-actions">
                  <button type="button" className="eatjobs-btn" onClick={nextRound}>
                    Next round
                  </button>
                  <Link href="/" className="eatjobs-btn eatjobs-btn-quiet">
                    Back to axd.labs
                  </Link>
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
          {screen === "playing" && hud.power ? (
            <span className="eatjobs-power">
              <b>{hud.power.label}</b> — {hud.power.blurb} ({hud.power.left.toFixed(1)}s)
            </span>
          ) : (
            <span className="eatjobs-power eatjobs-power-idle">
              {screen === "playing" ? `${hud.left} jobs left on the board` : " "}
            </span>
          )}
          <Link href="/" className="eatjobs-exit">
            ← Back to axd.labs
          </Link>
        </footer>
      </div>
    </div>
  );
}
