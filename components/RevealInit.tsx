"use client";

import { useEffect } from "react";

// Reveal-on-scroll: voegt .is-visible toe aan [data-reveal] elementen zodra ze
// in beeld komen (drempel 0.12, zelfde gedrag als site.js in het prototype).
export default function RevealInit() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not(.sp-reveal-bound)"
      );
      if (!("IntersectionObserver" in window)) {
        els.forEach((el) => {
          el.classList.add("is-visible");
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.filter = "none";
        });
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              el.classList.add("is-visible");
              el.style.opacity = "1";
              el.style.transform = "none";
              el.style.filter = "none";
              io.unobserve(el);
            }
          });
        },
        { threshold: 0.12 }
      );
      els.forEach((el) => {
        el.classList.add("sp-reveal-bound");
        io.observe(el);
      });
    }, 60);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
