"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  phrases: string[];
  /** ms per character while typing */
  typeSpeed?: number;
  /** ms per character while deleting */
  deleteSpeed?: number;
  /** ms to hold a fully-typed phrase before deleting */
  holdTime?: number;
  /** ms to pause on empty before typing the next phrase */
  gapTime?: number;
  className?: string;
};

/**
 * Typewriter that cycles through phrases: types one out, holds, deletes it,
 * pauses, then moves to the next, forever. A soft gradient caret blinks at
 * the end. Honors prefers-reduced-motion (first phrase only, no motion).
 */
export default function Typewriter({
  phrases,
  typeSpeed = 55,
  deleteSpeed = 26,
  holdTime = 1600,
  gapTime = 420,
  className = "",
}: Props) {
  const [text, setText] = useState("");
  const [reduce, setReduce] = useState(false);
  // State machine lives in refs so it survives re-renders.
  const phrase = useRef(0);
  const len = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setReduce(true);
      setText(phrases[0] ?? "");
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const current = phrases[phrase.current % phrases.length] ?? "";

      if (!deleting.current) {
        len.current += 1;
        setText(current.slice(0, len.current));
        if (len.current >= current.length) {
          deleting.current = true;
          timer = setTimeout(step, holdTime);
        } else {
          timer = setTimeout(step, typeSpeed);
        }
      } else {
        len.current -= 1;
        setText(current.slice(0, Math.max(0, len.current)));
        if (len.current <= 0) {
          deleting.current = false;
          phrase.current += 1;
          timer = setTimeout(step, gapTime);
        } else {
          timer = setTimeout(step, deleteSpeed);
        }
      }
    };

    timer = setTimeout(step, typeSpeed);
    return () => clearTimeout(timer);
  }, [phrases, typeSpeed, deleteSpeed, holdTime, gapTime]);

  return (
    <span className={className}>
      {text}
      {!reduce && <span className="tw-caret" aria-hidden="true" />}
    </span>
  );
}
