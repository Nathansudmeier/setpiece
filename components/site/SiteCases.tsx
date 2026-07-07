"use client";

import Link from "next/link";
import { WorkTile, Badge } from "@/components/ds";

export default function SiteCases() {
  const cases = [
    { href: "/cases/merkstrategie", tag: "Merkstrategie", title: "Van bestuurstaal naar een koers die leden meteen begrijpen." },
    { href: "/cases/digitale-identiteit", tag: "Digitale identiteit", title: "Een merk dat net zo hard meegroeit als het team." },
    { href: "/cases/ai-strategie", tag: "AI-strategie & advies", title: "Van losse experimenten naar één gericht stappenplan." },
  ];
  return (
    <section id="cases" className="sp-section" style={{ background: "var(--surface-page)" }}>
      <div className="sp-container">
        <p className="sp-eyebrow" data-reveal>Cases</p>
        <h2 className="sp-h2" data-reveal style={{ transitionDelay: "40ms" }}>
          Werk in uitvoering.
        </h2>
        <div className="sp-cases-grid">
          {cases.map((c, i) => (
            <Link key={c.href} href={c.href} className="sp-case-link" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <WorkTile>
                <Badge variant="tint" style={{ marginBottom: 14 }}>{c.tag}</Badge>
                <br />
                {c.title}
              </WorkTile>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
