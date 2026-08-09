"use client";

import Link from "next/link";

type Props = {
  saved: number;
  total: number;
  seconds: number;
  onReplay: () => void;
};

/** The reward for surviving all three rounds. Entirely worthless, suitably framed. */
export default function Certificate({ saved, total, seconds, onReplay }: Props) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);

  return (
    <div className="eatjobs-overlay">
      <div className="eatjobs-cert">
        <p className="eatjobs-cert-kicker">Certificate of</p>
        <h2 className="eatjobs-cert-title">
          Continued
          <br />
          Human Employment
        </h2>

        <p className="eatjobs-cert-body">
          Awarded to one (1) determined blob for outrunning an automated
          colleague across three consecutive rollouts.
        </p>

        <dl className="eatjobs-cert-stats">
          <div>
            <dt>Jobs saved</dt>
            <dd>
              {saved}
              <span className="eatjobs-cert-of">/{total}</span>
            </dd>
          </div>
          <div>
            <dt>Time served</dt>
            <dd>
              {minutes}m {String(rest).padStart(2, "0")}s
            </dd>
          </div>
          <div>
            <dt>Headcount</dt>
            <dd>Unchanged</dd>
          </div>
        </dl>

        <div className="eatjobs-cert-seal" aria-hidden />
        <p className="eatjobs-cert-fine">
          Valid until the next funding round. Not recognised by any employer,
          including the one that issued it.
        </p>

        <div className="eatjobs-actions">
          <button type="button" className="eatjobs-btn" onClick={onReplay}>
            Play again
          </button>
          <Link href="/" className="eatjobs-btn eatjobs-btn-quiet">
            Back to axd.labs
          </Link>
        </div>
      </div>
    </div>
  );
}
