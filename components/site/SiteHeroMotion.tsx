"use client";

import { useEffect, useRef } from "react";

export default function SiteHeroMotion() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      return;
    }

    path.style.strokeDashoffset = `${length}`;
    const frame = requestAnimationFrame(() => {
      path.style.strokeDashoffset = "0";
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const section = wrap?.closest("section");
    if (!wrap || !section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let rect = section.getBoundingClientRect();

    const updateRect = () => {
      rect = section.getBoundingClientRect();
    };
    const render = () => {
      frame = 0;
      const x = (pointerX - rect.left) / rect.width - 0.5;
      const y = (pointerY - rect.top) / rect.height - 0.5;
      wrap.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
    };
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      wrap.style.transform = "translate(0, 0)";
    };

    section.addEventListener("pointerenter", updateRect);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", updateRect);
    return () => {
      section.removeEventListener("pointerenter", updateRect);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", updateRect);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="sp-hero__motif" ref={wrapRef} aria-hidden="true">
      <svg viewBox="0 0 1200 750" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="var(--color-perkament)" strokeOpacity="0.16" strokeWidth="2">
          <rect x="60" y="70" width="1080" height="610" />
          <line x1="600" y1="70" x2="600" y2="680" />
          <circle cx="600" cy="375" r="90" />
          <rect x="60" y="230" width="150" height="290" />
          <rect x="60" y="305" width="60" height="140" />
          <path d="M 210 303 A 90 90 0 0 1 210 447" />
          <rect x="930" y="230" width="150" height="290" />
          <rect x="1080" y="305" width="60" height="140" />
          <path d="M 990 303 A 90 90 0 0 0 990 447" />
          <path d="M 60 88 A 18 18 0 0 1 78 70" />
          <path d="M 1122 70 A 18 18 0 0 1 1140 88" />
          <path d="M 60 662 A 18 18 0 0 0 78 680" />
          <path d="M 1122 680 A 18 18 0 0 0 1140 662" />
        </g>
        <circle cx="600" cy="375" r="3.5" fill="var(--color-perkament)" fillOpacity="0.22" />
        <circle cx="160" cy="375" r="3" fill="var(--color-perkament)" fillOpacity="0.2" />
        <circle cx="1040" cy="375" r="3" fill="var(--color-perkament)" fillOpacity="0.2" />
        <path
          ref={pathRef}
          className="sp-trajectory"
          d="M 360 560 C 520 540, 660 452, 748 322"
          fill="none"
          stroke="var(--color-amber)"
          strokeOpacity="0.85"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="748" cy="316" r="17" fill="none" stroke="var(--color-amber)" strokeWidth="2" opacity="0.9" />
        <circle cx="748" cy="316" r="4" fill="var(--color-amber)" />
      </svg>
    </div>
  );
}
