import Link from "next/link";
import { Button, Badge } from "@/components/ds";
import SiteHeroMotion from "@/components/site/SiteHeroMotion";

const HERO_WORK = [
  { label: "MV Artemis", href: "/cases/mv-artemis" },
  { label: "Nankaro", href: "/nankaro" },
  { label: "Set In", href: "/cases/set-in" },
];

export default function SiteHero() {
  return (
    <section className="sp-hero" id="top">
      <div className="gl-heroblobs" aria-hidden="true">
        <span className="gl-heroblob gl-heroblob--1"></span>
        <span className="gl-heroblob gl-heroblob--2"></span>
      </div>
      <SiteHeroMotion />
      <div className="sp-hero__inner">
        <Badge variant="outline" style={{ color: 'var(--text-secondary-on-dark)', borderColor: 'var(--border-on-dark)', marginBottom: 28 }}>
          Beschikbaar voor nieuwe projecten
        </Badge>
        <h1>
          Elke kans voorbereid.<br /><span className="accent">Elke campagne raak.</span>
        </h1>
        <p className="lead">
          Strategie, campagnes en digitale identiteit voor organisaties die willen groeien zonder losse flodders. Setpiece brengt merk, marketing en uitvoering samen in een helder spelplan.
        </p>
        <div className="sp-hero__ctas">
          <Button variant="primary" size="lg" href="#contact">
            Plan een kennismaking
          </Button>
          <Button variant="on-dark" size="lg" href="#cases">Bekijk het werk</Button>
        </div>
        <div className="sp-trustbar">
          <span className="sp-trustbar__line" aria-hidden="true"></span>
          <p className="sp-trustbar__label">Recent werk</p>
          <div className="sp-trustbar__work">
            {HERO_WORK.map((w) => (
              <Link key={w.label} href={w.href} className="sp-trustbar__client" prefetch={false}>
                {w.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
