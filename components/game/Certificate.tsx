"use client";

import Link from "next/link";
import PixelBlob from "./PixelBlob";

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
  const share = total ? Math.round((saved / total) * 100) : 0;

  return (
    <div className="eatjobs-overlay">
      <div className="pixel-frame eatjobs-cert">
        <div className="pixel-frame-in">
          <p className="eatjobs-cert-kicker">Certificate of</p>
          <h2 className="eatjobs-cert-title">
            Continued
            <br />
            Human Employment
          </h2>

          <div className="eatjobs-cert-seal">
            <PixelBlob size={54} />
          </div>

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
              <dt>Market share</dt>
              <dd>{share}%</dd>
            </div>
            <div>
              <dt>Time served</dt>
              <dd>
                {minutes}:{String(rest).padStart(2, "0")}
              </dd>
            </div>
          </dl>

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
    </div>
  );
}
