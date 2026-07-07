"use client";

import { useState, useEffect, useRef } from "react";

interface XPlayStep {
  n: string;
  title: string;
  body: string;
  at: number;
}

const XPLAY_STEPS: XPlayStep[] = [
  { n: '01', title: 'Kennismaking', body: 'We bespreken de situatie, het doel en wat er al is. Geen intake-formulier, gewoon een goed gesprek.', at: 0.04 },
  { n: '02', title: 'Strategie', body: 'Positionering en koers, vastgelegd in heldere taal. Getoetst voordat hij wordt vastgesteld.', at: 0.34 },
  { n: '03', title: 'Uitvoering', body: 'Identiteit, site of app, gebouwd op die koers. Elke keuze herleidbaar naar het spelplan.', at: 0.64 },
  { n: '04', title: 'Raak', body: 'Oplevering met documentatie. De fase is voorbereid, de kans is benut.', at: 0.96 },
];

export default function XPlay() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState<DOMPoint[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setPoints(XPLAY_STEPS.map((s) => path.getPointAtLength(s.at * len)));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const end = path.getPointAtLength(len);
      if (ballRef.current) ballRef.current.setAttribute('transform', `translate(${end.x},${end.y})`);
      setStep(XPLAY_STEPS.length - 1);
      return;
    }

    let raf: number | null = null;
    const update = () => {
      raf = null;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const pt = path.getPointAtLength(p * len);
      if (ballRef.current) ballRef.current.setAttribute('transform', `translate(${pt.x},${pt.y})`);
      let s = 0;
      for (let i = 0; i < XPLAY_STEPS.length; i++) {
        if (p >= XPLAY_STEPS[i].at - 0.02) s = i;
      }
      setStep(s);
    };
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const r = track.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: top + XPLAY_STEPS[i].at * (r.height - window.innerHeight),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  const active = XPLAY_STEPS[step];

  return (
    <section id="werkwijze" className="xp-play" data-screen-label="Werkwijze">
      <div className="xp-play__track" ref={trackRef}>
        <div className="xp-play__sticky">
          <svg className="xp-play__svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet">
            <path
              ref={pathRef}
              d="M 90 560 C 320 640, 520 540, 660 420 C 790 310, 900 260, 1060 220"
              fill="none" stroke="var(--color-amber)" strokeOpacity="0.75" strokeWidth="2.5"
              strokeDasharray="7 9" strokeLinecap="round"
            ></path>
            <circle cx="1060" cy="220" r="26" fill="none" stroke="var(--color-amber)" strokeWidth="2" strokeDasharray="4 7" opacity="0.9"></circle>
            <circle cx="1060" cy="220" r="44" fill="none" stroke="var(--color-perkament)" strokeOpacity="0.2" strokeWidth="1.5"></circle>
            {points.map((pt, i) => (
              <g
                key={XPLAY_STEPS[i].n}
                className="xp-play__step"
                transform={`translate(${pt.x},${pt.y})`}
                tabIndex={0}
                role="button"
                aria-label={`Ga naar stap ${XPLAY_STEPS[i].n}: ${XPLAY_STEPS[i].title}`}
                onClick={() => jumpTo(i)}
                onKeyDown={(e: React.KeyboardEvent<SVGGElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpTo(i); } }}
              >
                <circle
                  r="22" fill={step >= i ? 'var(--color-amber)' : 'var(--color-nacht)'}
                  stroke="var(--color-amber)" strokeWidth="2"
                  strokeDasharray={step >= i ? 'none' : '4 6'}
                  style={{ transition: 'fill 0.3s var(--ease-standard)' }}
                ></circle>
                <text
                  textAnchor="middle" dy="5"
                  fill={step >= i ? 'var(--color-nacht)' : 'var(--color-perkament)'}
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}
                >
                  {XPLAY_STEPS[i].n}
                </text>
              </g>
            ))}
            <g ref={ballRef}>
              <circle r="9" fill="var(--color-amber)"></circle>
              <circle r="16" fill="none" stroke="var(--color-amber)" strokeOpacity="0.4" strokeWidth="2"></circle>
            </g>
          </svg>
          <div className="xp-play__head">
            <p className="xp-kicker xp-kicker--on-dark">Werkwijze</p>
            <h2 className="xp-title xp-title--on-dark" style={{ marginBottom: 0 }}>
              Van voorbereiding<br />naar doelpunt.
            </h2>
          </div>
          <div className="xp-play__counter" aria-hidden="true">
            {active.n}<small>/ 04</small>
          </div>
          <div className="xp-play__panel">
            <span className="xp-play__panel-num">{active.n} — {step === XPLAY_STEPS.length - 1 ? 'de kans benut' : 'de fase loopt'}</span>
            <h3 className="xp-play__panel-title">{active.title}</h3>
            <p className="xp-play__panel-body">{active.body}</p>
          </div>
          <span className="xp-play__hint">Scroll of klik op een stap</span>
        </div>
      </div>
    </section>
  );
}
