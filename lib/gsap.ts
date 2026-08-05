"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, at import time. Every client component that needs
// scroll-linked animation imports gsap/ScrollTrigger from here rather than
// straight from the package, so registration only ever happens the once.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
