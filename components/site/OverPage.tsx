"use client";

import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteContact from "@/components/site/SiteContact";

export default function OverPage() {
  const principles = [
    { word: "Direct", body: "Geen omwegen. We zeggen wat we bedoelen, zonder vage bureautaal." },
    {
      word: "Menselijk",
      body: "We schrijven zoals we praten. Jargon alleen als het echt helpt, nooit om slim te klinken.",
    },
    { word: "Zelfverzekerd", body: 'Geen "we denken dat". We doen.' },
    { word: "Nuchter", body: "Humor mag, duidelijkheid gaat altijd voor." },
    { word: "Actief", body: "Actieve zinnen. Geen passieve mist." },
  ];
  return (
    <div data-screen-label="Over">
      <SiteNav mode="page" />
      <section className="sp-about-hero">
        <div className="sp-container">
          <p className="sp-eyebrow sp-eyebrow--on-dark" data-reveal>
            Over Setpiece
          </p>
          <h1 data-reveal style={{ transitionDelay: "60ms" }}>
            Een goed voorbereide fase wint het duel.
          </h1>
          <p className="lead" data-reveal style={{ transitionDelay: "120ms" }}>
            Setpiece is een studio voor strategie en digitale identiteit, gevestigd in Almere.
          </p>
        </div>
      </section>

      <section className="sp-section">
        <div className="sp-container sp-about-body">
          <p data-reveal>
            Een set piece is in het voetbal een ingestudeerde situatie — een corner of vrije trap
            die je zo vaak oefent dat hij raak is op het moment dat het telt. Die gedachte staat aan
            de basis van Setpiece: strategie en digitale identiteit zijn geen toeval, maar het
            resultaat van goede voorbereiding.
          </p>
          <p data-reveal style={{ transitionDelay: "60ms" }}>
            Ondernemingen en verenigingen komen bij Setpiece met een vraag die verder gaat dan een
            nieuw logo of een nieuwe website: hoe leg je uit wie je bent, in taal die iedereen
            begrijpt, en hoe maak je dat zichtbaar in alles wat je laat zien. Van positionering tot
            huisstijl, van campagne tot AI-strategie — elk project begint met dezelfde vraag: welke
            kans bereiden we voor.
          </p>
        </div>
      </section>

      <section className="sp-section" style={{ background: "var(--surface-card-tint)" }}>
        <div className="sp-container sp-about-body">
          <p className="sp-eyebrow" data-reveal>
            Hoe we werken
          </p>
          <h2 className="sp-h2" data-reveal style={{ transitionDelay: "40ms", marginBottom: 40 }}>
            Vijf uitgangspunten, in elk project.
          </h2>
          <ul className="sp-principles">
            {principles.map((p, i) => (
              <li key={p.word} data-reveal style={{ transitionDelay: `${i * 50}ms` }}>
                <strong>{p.word}</strong>
                <span>{p.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteContact />
      <SiteFooter mode="page" />
    </div>
  );
}
