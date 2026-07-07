"use client";

import { useState, useEffect } from "react";

type Audience = "onderneming" | "vereniging";

interface XPlanItem {
  n: string;
  title: string;
  body: string;
  x: number;
  y: number;
}

const XPLAN_ITEMS: XPlanItem[] = [
  { n: '01', title: 'Merkstrategie', body: 'Positionering, verhaal en een koers die iedereen in de organisatie kan uitleggen. De opstelling waar elke andere keuze op bouwt.', x: 14, y: 50 },
  { n: '02', title: 'Digitale identiteit', body: 'Huisstijl, website en UI die de strategie zichtbaar maken, online en in print. Herkenbaar in elke fase van het spel.', x: 36, y: 26 },
  { n: '03', title: 'Campagnes', body: 'Van concept tot uitvoering: campagnes die een duidelijk doel raken. Geen ruis, wel resultaat.', x: 36, y: 74 },
  { n: '04', title: 'AI-strategie & advies', body: 'Waar AI nu al waarde toevoegt in jouw organisatie, en waar (nog) niet. Nuchter advies, geen hype.', x: 58, y: 50 },
  { n: '05', title: 'App-ontwikkeling', body: 'Van idee naar werkende app, gebouwd op de strategie erachter. Techniek volgt de koers, niet andersom.', x: 80, y: 30 },
  { n: '06', title: 'Interim marketing', body: 'Tijdelijke slagkracht op je marketingteam. Direct inzetbaar, zonder inwerktijd te verspillen.', x: 80, y: 70 },
];

const XPLAN_SUBS: Record<Audience, string> = {
  onderneming: 'Elke dienst staat opgesteld rond dezelfde vraag: welke kans bereiden we voor. Kies een positie op het bord.',
  vereniging: 'Van ledenwerving tot een site die vrijwilligers zelf kunnen bijhouden. Kies een positie op het bord.',
};

export default function XPlan({ audience = 'onderneming' }: { audience: Audience }) {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (interacted) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % XPLAN_ITEMS.length), 3800);
    return () => clearInterval(t);
  }, [interacted]);

  const pick = (i: number) => { setInteracted(true); setActive(i); };
  const item = XPLAN_ITEMS[active];

  return (
    <section id="spelplan" className="xp-section xp-plan" data-screen-label="Spelplan">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p className="xp-kicker" data-reveal>Het spelplan</p>
        <h2 className="xp-title" data-reveal style={{ transitionDelay: '50ms' }}>
          Zes posities, één doel.
        </h2>
        <p className="xp-sub" data-reveal style={{ transitionDelay: '100ms' }}>
          <span className="xp-lead-swap" key={audience}>{XPLAN_SUBS[audience] || XPLAN_SUBS.onderneming}</span>
        </p>
      </div>
      <div className="xp-plan__layout">
        <div className="xp-boardwrap" data-reveal>
          <div className="xp-board">
            <svg className="xp-board__lines" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
              <g fill="none" stroke="var(--color-perkament)" strokeOpacity="0.14" strokeWidth="1">
                <rect x="8" y="8" width="284" height="184" rx="3"></rect>
                <line x1="150" y1="8" x2="150" y2="192"></line>
                <circle cx="150" cy="100" r="34"></circle>
                <rect x="8" y="55" width="38" height="90"></rect>
                <rect x="254" y="55" width="38" height="90"></rect>
              </g>
              <g fill="none" stroke="var(--color-amber)" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="3 5">
                <path d="M 42 100 L 108 52"></path>
                <path d="M 42 100 L 108 148"></path>
                <path d="M 108 52 L 174 100"></path>
                <path d="M 108 148 L 174 100"></path>
                <path d="M 174 100 L 240 60"></path>
                <path d="M 174 100 L 240 140"></path>
                <path d="M 240 60 L 288 96"></path>
                <path d="M 240 140 L 288 104"></path>
              </g>
            </svg>
            {XPLAN_ITEMS.map((it, i) => (
              <button
                key={it.n}
                type="button"
                className={`xp-marker ${active === i ? 'is-active' : ''}`}
                style={{ left: `${it.x}%`, top: `${it.y}%` }}
                onClick={() => pick(i)}
                onMouseEnter={() => pick(i)}
                aria-label={`${it.n} — ${it.title}`}
              >
                {it.n}
              </button>
            ))}
          </div>
        </div>
        <div className="xp-plan__detail" data-reveal style={{ transitionDelay: '80ms' }}>
          <div className="xp-plan__detail-card xp-plan__detail-anim" key={item.n}>
            <span className="xp-plan__detail-num">{item.n} / 06</span>
            <h3 className="xp-plan__detail-title">{item.title}</h3>
            <p className="xp-plan__detail-body">{item.body}</p>
          </div>
          <div className="xp-plan__dots" role="tablist" aria-label="Diensten">
            {XPLAN_ITEMS.map((it, i) => (
              <button
                key={it.n}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={it.title}
                className={active === i ? 'is-active' : ''}
                onClick={() => pick(i)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
