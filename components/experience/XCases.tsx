"use client";

import { useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { Badge, BigQuote } from "@/components/ds";

type Audience = "onderneming" | "vereniging";

type XTiltCardProps = {
  href: string;
  tag: string;
  title: string;
};

function XTiltCard({ href, tag, title }: XTiltCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.transition = 'box-shadow 0.2s var(--ease-standard)';
    el.style.transform = `perspective(800px) rotateX(${y * -7}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.4s var(--ease-snap), box-shadow 0.2s var(--ease-standard)';
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  return (
    <Link href={href} className="xp-case" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <span className="xp-case__arc" aria-hidden="true"></span>
      <div>
        <Badge variant="tint">{tag}</Badge>
        <h3 className="xp-case__title">{title}</h3>
      </div>
      <span className="xp-case__cta">Bekijk case →</span>
    </Link>
  );
}

export default function XCases({ audience = 'onderneming' }: { audience: Audience }) {
  const merk = { href: '/cases/merkstrategie', tag: 'Merkstrategie', title: 'Van bestuurstaal naar een koers die leden meteen begrijpen.' };
  const digi = { href: '/cases/digitale-identiteit', tag: 'Digitale identiteit', title: 'Een merk dat net zo hard meegroeit als het team.' };
  const ai = { href: '/cases/ai-strategie', tag: 'AI-strategie & advies', title: 'Van losse experimenten naar één gericht stappenplan.' };
  const cases = audience === 'vereniging' ? [merk, digi, ai] : [digi, ai, merk];
  return (
    <section id="bewijs" className="xp-section xp-cases" data-screen-label="Bewijs">
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p className="xp-kicker" data-reveal>Het bewijs</p>
        <h2 className="xp-title" data-reveal style={{ transitionDelay: '50ms' }}>
          Werk dat raak was.
        </h2>
      </div>
      <div className="xp-cases__grid">
        {cases.map((c, i) => (
          <div key={c.href} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <XTiltCard {...c} />
          </div>
        ))}
      </div>
      <div className="xp-cases__quote" data-reveal>
        <BigQuote by="Bestuurslid, brancheorganisatie">
          Setpiece zette in zes weken een positionering neer die het hele bestuur zelf kan uitleggen. Geen jargon, wel resultaat.
        </BigQuote>
      </div>
    </section>
  );
}
