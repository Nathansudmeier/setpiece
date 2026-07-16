import { Card } from "@/components/ds";

export default function SiteServices() {
  const propositions = [
    {
      title: "Positioneringssprint",
      intro: "Voor organisaties met een goed verhaal dat nog te vaag, te versnipperd of te intern klinkt.",
      output: [
        "scherpe merkpositionering",
        "doelgroepkeuze",
        "kernboodschap",
        "tone of voice",
        "communicatiebasis",
      ],
    },
    {
      title: "Campagnekompas",
      intro: "Voor organisaties die zichtbaarheid willen omzetten in actie, aanvragen of betrokkenheid.",
      output: [
        "campagneconcept",
        "kanaalkeuze",
        "contentlijnen",
        "planning",
        "meetpunten",
      ],
    },
    {
      title: "AI-transitieplan",
      intro: "Voor teams die slimmer willen werken met AI zonder chaos, trucjes of losse tools.",
      output: [
        "praktische AI-workflows",
        "content- en communicatieprocessen",
        "interne werkwijze",
        "implementatieadvies",
      ],
    },
  ];

  const items = [
    { n: '01', title: 'Merkstrategie', body: 'Positionering, verhaal en een koers die iedereen in de organisatie kan uitleggen.' },
    { n: '02', title: 'Digitale identiteit', body: 'Huisstijl, website en UI die de strategie zichtbaar maken, online en in print.' },
    { n: '03', title: 'Campagnes', body: 'Van concept tot uitvoering: campagnes die een duidelijk doel raken.' },
    { n: '04', title: 'AI-strategie & advies', body: 'Waar AI nu al waarde toevoegt in jouw organisatie, en waar (nog) niet.' },
    { n: '05', title: 'App-ontwikkeling', body: 'Van idee naar werkende app, gebouwd op de strategie erachter.' },
    { n: '06', title: 'Interim marketing', body: 'Tijdelijke slagkracht op je marketingteam, zonder inwerktijd te verspillen.' },
  ];

  const audience = [
    "Je verhaal is goed, maar nog niet scherp genoeg.",
    "Je marketing bestaat uit losse acties zonder duidelijke lijn.",
    "Je website of digitale identiteit voelt niet professioneel genoeg.",
    "Je wilt AI gebruiken, maar praktisch en zonder circus.",
    "Je zoekt tijdelijke senior marketingkracht met strategisch overzicht.",
  ];

  return (
    <section id="diensten" className="sp-section" style={{ background: 'var(--surface-page)' }}>
      <div className="sp-container">
        <p className="sp-eyebrow" data-reveal>Spelplan</p>
        <h2 className="sp-h2" data-reveal style={{ transitionDelay: '40ms' }}>
          Waar Setpiece bij helpt
        </h2>
        <div className="sp-propositions-grid">
          {propositions.map((item, i) => (
            <div key={item.title} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <Card variant={i === 1 ? 'tint' : 'surface'} style={{ height: '100%' }} className="sp-proposition-card">
                <h3>{item.title}</h3>
                <p>{item.intro}</p>
                <span className="sp-proposition-card__label">Output</span>
                <ul>
                  {item.output.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        <div className="sp-services-block">
          <p className="sp-eyebrow" data-reveal>Bouwstenen</p>
          <h2 className="sp-h2 sp-h2--compact" data-reveal style={{ transitionDelay: '40ms' }}>
          Zes disciplines, onder één dak.
          </h2>
          <details className="sp-services-details">
            <summary>Bekijk de zes bouwstenen</summary>
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
          </details>
        </div>

        <div className="sp-audience" data-reveal>
          <div>
            <p className="sp-eyebrow">Voor wie</p>
            <h2 className="sp-h2 sp-h2--compact">Voor organisaties die scherper willen spelen.</h2>
            <p className="sp-audience__intro">
              Setpiece helpt organisaties die voelen dat hun merk, marketing of digitale uitstraling beter kan. Niet met dikke rapporten die verdwijnen in een map, maar met keuzes, ritme en werk dat zichtbaar wordt.
            </p>
          </div>
          <div>
            <ul className="sp-audience__list">
              {audience.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="sp-audience__note">
              Niet ideaal als je alleen even snel een postje zoekt of geen keuzes wilt maken.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
