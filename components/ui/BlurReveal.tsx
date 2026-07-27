"use client";

import { type ElementType, useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  /** Tag to render as. Defaults to a span. */
  as?: ElementType;
  className?: string;
  /** ms between each letter */
  stagger?: number;
  /** initial delay before the first letter, ms */
  delay?: number;
  style?: React.CSSProperties;
};

/**
 * Apple-style text reveal: each letter settles in from slightly above with a
 * soft blur, staggered so the line resolves letter-by-letter, top-to-bottom.
 * Fires once when scrolled into view. Words stay unbroken (inline-block) so
 * wrapping is natural. Honors prefers-reduced-motion (renders plainly).
 */
export default function BlurReveal({
  text,
  as: Tag = "span",
  className = "",
  stagger = 18,
  delay = 0,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");
  let i = 0; // running letter index for stagger

  return (
    <Tag
      ref={ref}
      className={`blur-reveal ${shown ? "in" : ""} ${className}`}
      style={style}
      aria-label={text}
    >
      {words.map((word, w) => {
        const wordEl = (
          <span key={w} className="blur-word" aria-hidden="true">
            {Array.from(word).map((ch, c) => {
              const idx = i++;
              return (
                <span
                  key={c}
                  className="blur-letter"
                  style={{ transitionDelay: `${delay + idx * stagger}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        // A real space between words (outside the inline-block) so lines wrap.
        return w < words.length - 1
          ? [wordEl, <span key={`sp-${w}`}> </span>]
          : wordEl;
      })}
    </Tag>
  );
}
