"use client";

import { useEffect } from "react";

// Progressive enhancement: content is zichtbaar zonder JavaScript. Alleen
// elementen onder de vouw krijgen na hydration tijdelijk een pending-state.
export default function RevealInit() {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const frame = requestAnimationFrame(() => {
      const els = document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not(.sp-reveal-bound)"
      );
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!("IntersectionObserver" in window) || reduced) {
        els.forEach((el) => el.classList.add("is-visible", "sp-reveal-bound"));
        return;
      }

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              el.classList.remove("is-pending");
              el.classList.add("is-visible");
              io.unobserve(el);
            }
          });
        },
        { threshold: 0.12 }
      );
      observer = io;
      els.forEach((el) => {
        el.classList.add("sp-reveal-bound");
        if (el.getBoundingClientRect().top <= window.innerHeight * 1.1) {
          el.classList.add("is-visible");
        } else {
          el.classList.add("is-pending");
          io.observe(el);
        }
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);
  return null;
}
