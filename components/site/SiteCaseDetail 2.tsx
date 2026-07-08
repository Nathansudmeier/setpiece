"use client";

import Link from "next/link";
import { Button } from "@/components/ds";

type CaseSection = {
  heading: string;
  body: string;
};

type SiteCaseDetailProps = {
  eyebrow: string;
  title: string;
  lead: string;
  statNum: string;
  statLabel: string;
  sections: CaseSection[];
  ctaNote: string;
};

export default function SiteCaseDetail({
  eyebrow,
  title,
  lead,
  statNum,
  statLabel,
  sections,
  ctaNote,
}: SiteCaseDetailProps) {
  const mailHref =
    "mailto:hello@setpiece.nl?subject=" + encodeURIComponent("Vraag over " + title);
  return (
    <>
      <section className="sp-case-hero">
        <div className="sp-container">
          <Link href="/#cases" className="sp-back-link">
            ← Terug naar cases
          </Link>
          <p className="sp-eyebrow sp-eyebrow--on-dark" data-reveal>
            {eyebrow}
          </p>
          <h1 data-reveal style={{ transitionDelay: "60ms" }}>
            {title}
          </h1>
          <p className="lead" data-reveal style={{ transitionDelay: "120ms" }}>
            {lead}
          </p>
          <div className="sp-case-stat" data-reveal style={{ transitionDelay: "180ms" }}>
            <span className="sp-case-stat__num">{statNum}</span>
            <span className="sp-case-stat__label">{statLabel}</span>
          </div>
        </div>
      </section>
      <section className="sp-case-body">
        {sections.map((s, i) => (
          <div key={s.heading} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </div>
        ))}
      </section>
      <section className="sp-case-cta">
        <p>{ctaNote}</p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            window.location.href = mailHref;
          }}
        >
          Trap af →
        </Button>
      </section>
    </>
  );
}
