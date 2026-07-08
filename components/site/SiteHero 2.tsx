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
        viewBox="0 0 1200 750" preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        {/* Voetbalveld-markeringen (perkament, subtiel). Middencirkel en
            middellijn staan centraal zodat ze bij elk formaat zichtbaar
            blijven; de strafschopgebieden mogen op smalle schermen weglopen. */}
        <g fill="none" stroke="var(--color-perkament)" strokeOpacity="0.16" strokeWidth="2">
          <rect x="60" y="70" width="1080" height="610" />
          <line x1="600" y1="70" x2="600" y2="680" />
          <circle cx="600" cy="375" r="90" />
          {/* Linker strafschop- en doelgebied */}
          <rect x="60" y="230" width="150" height="290" />
          <rect x="60" y="305" width="60" height="140" />
          <path d="M 210 303 A 90 90 0 0 1 210 447" />
          {/* Rechter strafschop- en doelgebied */}
          <rect x="930" y="230" width="150" height="290" />
          <rect x="1080" y="305" width="60" height="140" />
          <path d="M 990 303 A 90 90 0 0 0 990 447" />
          {/* Hoekbogen */}
          <path d="M 60 88 A 18 18 0 0 1 78 70" />
          <path d="M 1122 70 A 18 18 0 0 1 1140 88" />
          <path d="M 60 662 A 18 18 0 0 0 78 680" />
          <path d="M 1122 680 A 18 18 0 0 0 1140 662" />
        </g>
        <circle cx="600" cy="375" r="3.5" fill="var(--color-perkament)" fillOpacity="0.22" />
        <circle cx="160" cy="375" r="3" fill="var(--color-perkament)" fillOpacity="0.2" />
        <circle cx="1040" cy="375" r="3" fill="var(--color-perkament)" fillOpacity="0.2" />

        {/* Set piece: het schot dat zichzelf tekent en op de ring landt */}
        <path
          ref={pathRef}
          className="sp-trajectory"
          d="M 360 560 C 520 540, 660 452, 748 322"
          fill="none" stroke="var(--color-amber)" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx="748" cy="316" r="17" fill="none" stroke="var(--color-amber)" strokeWidth="2" opacity="0.9" />
        <circle cx="748" cy="316" r="4" fill="var(--color-amber)" />
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
