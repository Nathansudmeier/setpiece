"use client";

import { useEffect, useRef } from "react";
import { Button, Badge } from "@/components/ds";

function PitchMotif() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    if (reduced) {
      path.style.strokeDashoffset = '0';
      return;
    }
    path.style.strokeDashoffset = `${len}`;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = wrap.closest('section');
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      wrap.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
    };
    const onLeave = () => { wrap.style.transform = 'translate(0,0)'; };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="sp-hero__motif" ref={wrapRef}>
      <svg
        viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        <path d="M 0 60 A 60 60 0 0 1 60 0" fill="none" stroke="var(--color-perkament)" strokeOpacity="0.22" strokeWidth="2" />
        <path d="M 1140 640 A 60 60 0 0 0 1200 580" fill="none" stroke="var(--color-perkament)" strokeOpacity="0.16" strokeWidth="2" />
        <circle cx="1180" cy="220" r="230" fill="none" stroke="var(--color-perkament)" strokeOpacity="0.14" strokeWidth="1.5" strokeDasharray="3 7" />
        <circle cx="1180" cy="220" r="230" fill="none" stroke="var(--color-perkament)" strokeOpacity="0.1" strokeWidth="1.5" />
        <path
          ref={pathRef}
          className="sp-trajectory"
          d="M 40 520 C 260 560, 420 420, 560 300"
          fill="none" stroke="var(--color-amber)" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx="560" cy="300" r="16" fill="none" stroke="var(--color-amber)" strokeWidth="2" opacity="0.9" />
        <circle cx="560" cy="300" r="4" fill="var(--color-amber)" />
      </svg>
    </div>
  );
}

type SiteHeroProps = {
  onNavigate?: (id: string) => void;
};

export default function SiteHero({ onNavigate }: SiteHeroProps) {
  return (
    <section className="sp-hero" id="top">
      <div className="gl-heroblobs" aria-hidden="true">
        <span className="gl-heroblob gl-heroblob--1"></span>
        <span className="gl-heroblob gl-heroblob--2"></span>
      </div>
      <PitchMotif />
      <div className="sp-hero__inner">
        <Badge variant="outline" style={{ color: 'var(--text-secondary-on-dark)', borderColor: 'var(--border-on-dark)', marginBottom: 28 }} data-reveal>
          Beschikbaar voor nieuwe projecten
        </Badge>
        <h1 data-reveal style={{ transitionDelay: '60ms' }}>
          Elke kans voorbereid.<br /><span className="accent">Elke campagne raak.</span>
        </h1>
        <p className="lead" data-reveal style={{ transitionDelay: '120ms' }}>
          Strategie en digitale identiteit voor ondernemingen en verenigingen. Een goed voorbereide fase wint het duel — daar draait het om.
        </p>
        <div className="sp-hero__ctas" data-reveal style={{ transitionDelay: '180ms' }}>
          <Button variant="primary" size="lg" onClick={() => { window.location.href = 'mailto:hello@setpiece.nl?subject=' + encodeURIComponent('Nieuw project via setpiece.nl'); }}>
            Trap af →
          </Button>
          <Button variant="on-dark" size="lg" onClick={() => onNavigate?.('cases')}>Bekijk het werk</Button>
        </div>
      </div>
    </section>
  );
}
