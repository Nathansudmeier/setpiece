"use client";

import Link from "next/link";
import { Badge, Card } from "@/components/ds";

export default function SiteCases() {
  const cases = [
    {
      href: "/cases/set-in",
      tag: "AI-werkomgeving",
      title: "Set In: een AI-werkomgeving die hun taal spreekt",
      problem: "Waardevolle kennis, maar te veel tijd kwijt aan presentaties, offertes en content.",
      approach: "Een AI-werkomgeving op maat, met training en doorlopende begeleiding.",
      output: "Routinewerk dat naar de achtergrond verdwijnt, met de mens aan het stuur.",
      cta: "Lees case",
    },
    {
      href: "/cases/mv-artemis",
      tag: "Clubidentiteit",
      title: "MV Artemis: van ambitie naar herkenbare clubidentiteit",
      problem: "Een jonge vrouwenvoetbalclub met groeiplannen had een herkenbaar verhaal nodig.",
      approach: "Merkverhaal, visuele stijl en communicatiebasis voor bestuur, team en achterban.",
      output: "Een identiteit die ambitie professioneel en menselijk zichtbaar maakt.",
      cta: "Lees case",
    },
    {
      href: "/nankaro",
      tag: "Sportplatform",
      title: "Nankaro: van idee naar digitaal clubplatform",
      problem: "Een productidee in de sportwereld vroeg om scherpere keuzes en een geloofwaardige basis.",
      approach: "Productstrategie, UX-denken en merkontwikkeling voor een SaaS-platform.",
      output: "Een digitaal platformconcept met richting, structuur en merkgevoel.",
      cta: "Lees case",
    },
  ];
  return (
    <section id="cases" className="sp-section" style={{ background: "var(--surface-page)" }}>
      <div className="sp-container">
        <p className="sp-eyebrow" data-reveal>Cases</p>
        <h2 className="sp-h2" data-reveal style={{ transitionDelay: "40ms" }}>
          Werk dat richting geeft.
        </h2>
        <div className="sp-cases-grid">
          {cases.map((c, i) => (
            <Link key={c.title} href={c.href} className="sp-case-link" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <Card variant="surface" className="sp-case-card" style={{ height: "100%" }}>
                <Badge variant="tint">{c.tag}</Badge>
                <h3>{c.title}</h3>
                <dl>
                  <div>
                    <dt>Probleem</dt>
                    <dd>{c.problem}</dd>
                  </div>
                  <div>
                    <dt>Aanpak</dt>
                    <dd>{c.approach}</dd>
                  </div>
                  <div>
                    <dt>Output</dt>
                    <dd>{c.output}</dd>
                  </div>
                </dl>
                <span className="sp-case-card__cta">{c.cta}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
