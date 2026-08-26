"use client";

import { useEffect, useRef, useState } from "react";

/** Pause CSS animations when the scene is offscreen. */
export function usePauseOffscreen<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { rootMargin: "64px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, paused };
}
