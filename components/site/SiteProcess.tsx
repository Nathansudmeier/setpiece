"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PlayMarker } from "@/components/ds";

export default function SiteProcess() {
  const steps = [
    { n: '01', title: 'Kennismaking', body: 'We bespreken de situatie, het doel en wat er al is.' },
    { n: '02', title: 'Strategie', body: 'Positionering en koers, vastgelegd in heldere taal.' },
    { n: '03', title: 'Uitvoering', body: 'Identiteit, site of app, gebouwd op die koers.' },
    { n: '04', title: 'Raak', body: 'Oplevering met documentatie — de fase is voorbereid, de kans is benut.' },
  ];
  const [active, setActive] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ballLeft, setBallLeft] = useState<number | null>(null);

  const measure = useCallback(() => {
    const grid = gridRef.current;
    const el = stepRefs.current[active];
    if (!grid || !el) return;
    const ring = el.querySelector('.sp-playmarker__ring');
    const target = ring || el;
    const gridRect = grid.getBoundingClientRect();
    const elRect = target.getBoundingClientRect();
    const center = elRect.left + elRect.width / 2 - gridRect.left;
    setBallLeft(center);
  }, [active]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <section id="werkwijze" className="sp-section" style={{ background: 'var(--surface-card-tint)' }}>
      <div className="sp-container">
        <p className="sp-eyebrow" data-reveal>Werkwijze</p>
        <h2 className="sp-h2" data-reveal style={{ transitionDelay: '40ms' }}>
          Van voorbereiding naar doelpunt.
        </h2>
        <div className="sp-process-grid" ref={gridRef} onMouseLeave={() => setActive(0)}>
          <div className="sp-process-line" />
          <div
            className={`sp-process-ball ${ballLeft !== null ? 'is-active' : ''}`}
            style={ballLeft !== null ? { left: `${ballLeft}px` } : undefined}
          />
          {steps.map((s, i) => (
            <div
              key={s.n}
              ref={(el) => { stepRefs.current[i] = el; }}
              className={`sp-process-step ${active === i ? 'is-active' : ''}`}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
            >
              <PlayMarker n={s.n} title={s.title}>{s.body}</PlayMarker>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
