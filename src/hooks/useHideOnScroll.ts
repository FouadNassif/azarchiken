"use client";

import { useEffect, useRef, useState } from "react";

/** Returns true while the navbar should be hidden: scrolling down past a threshold. Shows again on scroll up or near the top. */
export function useHideOnScroll(threshold = 12) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 80) {
          setHidden(false);
        } else if (y - lastY.current > threshold) {
          setHidden(true);
        } else if (lastY.current - y > threshold) {
          setHidden(false);
        }
        lastY.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
