"use client";

import { Card } from "@/components/ds";

export default function SiteServices() {
  const items = [
    { n: '01', title: 'Merkstrategie', body: 'Positionering, verhaal en een koers die iedereen in de organisatie kan uitleggen.' },
    { n: '02', title: 'Digitale identiteit', body: 'Huisstijl, website en UI die de strategie zichtbaar maken, online en in print.' },
    { n: '03', title: 'Campagnes', body: 'Van concept tot uitvoering: campagnes die een duidelijk doel raken.' },
    { n: '04', title: 'AI-strategie & advies', body: 'Waar AI nu al waarde toevoegt in jouw organisatie, en waar (nog) niet.' },
    { n: '05', title: 'App-ontwikkeling', body: 'Van idee naar werkende app, gebouwd op de strategie erachter.' },
    { n: '06', title: 'Interim marketing', body: 'Tijdelijke slagkracht op je marketingteam, zonder inwerktijd te verspillen.' },
  ];
  return (
    <section id="diensten" className="sp-section" style={{ background: 'var(--surface-page)' }}>
      <div className="sp-container">
        <p className="sp-eyebrow" data-reveal>Spelplan</p>
        <h2 className="sp-h2" data-reveal style={{ transitionDelay: '40ms' }}>
          Zes disciplines, onder één dak.
        </h2>
        <div className="sp-services-grid">
          {items.map((it, i) => (
            <div key={it.title} data-reveal style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
              <Card variant={i % 2 === 0 ? 'surface' : 'tint'} style={{ height: '100%' }}>
                <span className="sp-service-num">{it.n}</span>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                  color: i % 2 === 0 ? 'var(--color-nacht)' : 'var(--color-indigo)', margin: '0 0 10px',
                }}>
                  {it.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7,
                  color: i % 2 === 0 ? 'var(--text-muted)' : 'var(--color-indigo)', margin: 0,
                }}>
                  {it.body}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
