"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button, Badge } from "@/components/ds";

type XAudience = "onderneming" | "vereniging";

const XHERO_LEADS: Record<XAudience, string> = {
  onderneming: 'Strategie en digitale identiteit voor ondernemingen. Geen losse flodders, maar een plan dat elke campagne raak maakt.',
  vereniging: 'Strategie en digitale identiteit voor verenigingen. Een verhaal dat het hele bestuur kan uitleggen en waar leden zich in herkennen.',
};

export function XMagnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transition = 'transform 0.1s linear';
    el.style.transform = `translate(${x * 0.16}px, ${y * 0.28}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.45s var(--ease-snap)';
    el.style.transform = 'translate(0, 0)';
  };
  return (
    <span className="xp-magnet" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  );
}

type XHeroProps = {
  audience: XAudience;
  onAudience: (a: XAudience) => void;
};

export default function XHero({ audience = 'onderneming', onAudience = () => {} }: XHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pitchRef = useRef<HTMLDivElement | null>(null);
  const c1 = useRef<HTMLDivElement | null>(null);
  const c2 = useRef<HTMLDivElement | null>(null);
  const c3 = useRef<HTMLDivElement | null>(null);
  const [motionOk] = useState(() => (
    typeof window !== "undefined" && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    if (!motionOk) return;
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (pitchRef.current) {
        pitchRef.current.style.transform = `rotateX(${63 + y * 2.5}deg) rotateY(${x * 2}deg)`;
      }
      if (c1.current) c1.current.style.transform = `translate(${x * -30}px, ${y * -20}px)`;
      if (c2.current) c2.current.style.transform = `translate(${x * -16}px, ${y * -12}px)`;
      if (c3.current) c3.current.style.transform = `translate(${x * -46}px, ${y * -30}px)`;
    };
    const onLeave = () => {
      if (pitchRef.current) pitchRef.current.style.transform = 'rotateX(63deg)';
      [c1, c2, c3].forEach((c) => { if (c.current) c.current.style.transform = 'translate(0,0)'; });
    };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, [motionOk]);

  const goPlan = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const el = document.getElementById('spelplan');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
  };
  const shotD = 'M 600 620 C 760 470, 840 260, 640 110';

  return (
    <section className="xp-hero" ref={sectionRef} id="top" data-screen-label="Hero">
      <div className="xp-hero__depth" aria-hidden="true">
        <div ref={c1} className="xp-hero__circle gl-liquid" style={{ width: 620, height: 620, top: '-220px', right: '-160px', opacity: 0.05 }}></div>
        <div ref={c2} className="xp-hero__circle gl-liquid gl-liquid--b" style={{ width: 340, height: 340, top: '18%', right: '14%', opacity: 0.04 }}></div>
        <div ref={c3} className="xp-hero__circle gl-liquid gl-liquid--c" style={{ width: 180, height: 180, top: '8%', left: '4%', opacity: 0.05 }}></div>
      </div>
      <div className="xp-pitchwrap" aria-hidden="true">
        <div className="xp-pitch" ref={pitchRef}>
          <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
            <g fill="none" stroke="var(--color-perkament)" strokeOpacity="0.16" strokeWidth="2">
              <rect x="40" y="20" width="1120" height="760" rx="4"></rect>
              <line x1="40" y1="400" x2="1160" y2="400"></line>
              <circle cx="600" cy="400" r="120"></circle>
              <rect x="340" y="20" width="520" height="160"></rect>
              <rect x="340" y="620" width="520" height="160"></rect>
              <path d="M 460 180 A 120 120 0 0 0 740 180"></path>
              <path d="M 460 620 A 120 120 0 0 1 740 620"></path>
            </g>
            <path
              className="xp-shot"
              d={shotD}
              pathLength="1"
              fill="none"
              stroke="var(--color-amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.75"
            ></path>
            <circle className="xp-shot-ring" cx="640" cy="110" r="26" fill="none" stroke="var(--color-amber)" strokeWidth="2" strokeDasharray="4 7"></circle>
            <circle cx="600" cy="620" r="10" fill="var(--color-amber)"></circle>
            <circle cx="600" cy="620" r="26" fill="none" stroke="var(--color-amber)" strokeWidth="2" strokeDasharray="4 7" opacity="0.7"></circle>
            {motionOk && (
              <circle r="9" fill="var(--color-amber)" opacity="0">
                <set attributeName="opacity" to="1" begin="0.95s" fill="freeze"></set>
                <animateMotion begin="0.95s" dur="1.05s" fill="freeze" path={shotD}></animateMotion>
              </circle>
            )}
          </svg>
        </div>
      </div>
      <div className="xp-hero__inner">
        <div className="xp-enter xp-enter--1" style={{ marginBottom: 28 }}>
          <Badge variant="outline" style={{ color: 'var(--text-secondary-on-dark)', borderColor: 'var(--border-on-dark)' }}>
            Beschikbaar voor nieuwe projecten
          </Badge>
        </div>
        <h1>
          <span className="xp-hero__line"><span>Elke kans voorbereid.</span></span>
          <span className="xp-hero__line"><span className="accent">Elke campagne raak.</span></span>
        </h1>
        <div className="xp-audience xp-enter xp-enter--2" role="group" aria-label="Voor wie kijk je">
          <button
            type="button"
            className={audience === 'onderneming' ? 'is-active' : ''}
            aria-pressed={audience === 'onderneming'}
            onClick={() => onAudience('onderneming')}
          >Voor ondernemingen</button>
          <button
            type="button"
            className={audience === 'vereniging' ? 'is-active' : ''}
            aria-pressed={audience === 'vereniging'}
            onClick={() => onAudience('vereniging')}
          >Voor verenigingen</button>
        </div>
        <p className="xp-hero__lead xp-enter xp-enter--2">
          <span className="xp-lead-swap" key={audience}>{XHERO_LEADS[audience] || XHERO_LEADS.onderneming}</span>
        </p>
        <div className="xp-hero__ctas xp-enter xp-enter--3">
          <XMagnetic>
            <Button variant="primary" size="lg" href="/#contact">Plan een kennismaking</Button>
          </XMagnetic>
          <Button variant="on-dark" size="lg" onClick={goPlan}>Bekijk het spelplan</Button>
        </div>
      </div>
      <a href="#spelplan" className="xp-scrollcue" onClick={goPlan}>
        <span className="xp-scrollcue__dot"></span>
        Scroll voor de aftrap
      </a>
    </section>
  );
}
