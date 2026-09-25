import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { LITERACY_ARTICLE_PATH, LITERACY_DESCRIPTION, LITERACY_FAQ, LITERACY_PATH, LITERACY_REQUEST_PATH } from "@/lib/ai-geletterdheid";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Training AI-geletterdheid voor bedrijven",
  description: LITERACY_DESCRIPTION,
  path: LITERACY_PATH,
});

const OUTCOMES = [
  ["Beter beoordelen", "Medewerkers herkennen fouten en onzekerheid in AI-antwoorden. Ze controleren bronnen voordat ze een uitkomst gebruiken."],
  ["Veiliger werken", "Je team weet welke hulpmiddelen en gegevens het mag gebruiken, wie controleert en wanneer het hulp vraagt."],
  ["Samen verder", "Je houdt werkafspraken, oefenmateriaal en een verantwoordelijke over. Na dertig dagen bespreken we wat werkelijk wordt toegepast."],
] as const;

const STEPS = [
  ["Voorbereiden", "In dertig minuten bespreken we doel, startniveau en hulpmiddelen. We kiezen twee herkenbare werksituaties."],
  ["Oefenen", "Een sessie van drie uur voor maximaal twaalf deelnemers. Van een goede opdracht tot een gecontroleerde uitkomst."],
  ["Vastleggen", "Binnen vijf werkdagen ontvang je materiaal en conceptwerkafspraken. De opdrachtgever stelt de afspraken vast."],
  ["Toepassen", "Na ongeveer dertig dagen volgt een online gebruiksgesprek van 45 minuten. We bespreken leerpunten en vervolg."],
] as const;

export default function AiGeletterdheidPage() {
  return (
    <WorkspoorShell activePath={LITERACY_PATH}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${SITE_URL}ai-geletterdheid#service`,
            name: "Training AI-geletterdheid voor bedrijven",
            serviceType: "Teamtraining AI-geletterdheid met opvolging en lezingen",
            description: LITERACY_DESCRIPTION,
            url: new URL(LITERACY_PATH, SITE_URL).toString(),
            provider: { "@id": `${SITE_URL}#organization` },
            areaServed: { "@type": "Country", name: "Nederland" },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL.toString() },
              { "@type": "ListItem", position: 2, name: "AI-geletterdheid", item: new URL(LITERACY_PATH, SITE_URL).toString() },
            ],
          },
        ],
      }} />

      <section className="ws-page-hero ws-literacy-hero">
        <div className="ws-frame ws-page-hero__grid">
          <div>
            <nav className="ws-breadcrumb" aria-label="Broodkruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>AI-geletterdheid</span></nav>
            <p className="ws-context">AI-geletterdheid voor bedrijven</p>
            <h1>Je team gebruikt AI.<br />Nu met kennis en duidelijke afspraken.</h1>
            <p className="ws-lead">Een praktische training AI-geletterdheid rond jullie dagelijkse werk. Medewerkers leren oefenen, controleren en verantwoord beslissen. Met werkafspraken en opvolging na dertig dagen.</p>
            <div className="ws-inline-actions">
              <Link className="ws-button" href={LITERACY_REQUEST_PATH}>Bespreek de teamtraining</Link>
              <a className="ws-text-link" href="#programma">Bekijk het programma</a>
            </div>
          </div>
          <aside className="ws-literacy-summary" aria-label="De training in het kort">
            <p className="ws-context">Van weten naar doen</p>
            <dl>
              <div><dt>3 uur</dt><dd>praktisch oefenen met je team</dd></div>
              <div><dt>Max. 12</dt><dd>deelnemers per groep</dd></div>
              <div><dt>Na 30 dagen</dt><dd>samen het gebruik bespreken</dd></div>
            </dl>
            <p>Op locatie of live online. Prijs op aanvraag, met een vaste offerte vooraf.</p>
            <a className="ws-text-link" href="#lezing">Ook als lezing of presentatie</a>
          </aside>
        </div>
      </section>

      <section className="ws-literacy-section" aria-labelledby="literacy-result">
        <div className="ws-frame">
          <div className="ws-section-heading"><p>Voor medewerkers én leidinggevenden</p><h2 id="literacy-result">Meer grip op wat je team met AI doet.</h2></div>
          <div className="ws-literacy-outcomes">{OUTCOMES.map(([title, text], index) => <article key={title}><span className="ws-literacy-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="ws-literacy-section ws-literacy-section--mist" id="programma" aria-labelledby="literacy-programme">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Teamtraining met opvolging</p><h2 id="literacy-programme">Leren aan de hand van het werk dat er al ligt.</h2><p>Een klantmail, offertevoorbereiding of samenvatting. We kiezen vooraf twee werksituaties die jouw team herkent. Je hoeft geen technische voorkennis te hebben.</p><p>We behandelen wat AI kan en waar het misgaat: onjuiste informatie, vooroordelen, privacy en te veel vertrouwen in een antwoord. Medewerkers oefenen met opdrachten formuleren, bronnen controleren en zelf beslissen.</p></div>
          <ol className="ws-literacy-steps">{STEPS.map(([title, text], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="ws-literacy-section" aria-labelledby="literacy-example">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Zo ziet oefenen eruit</p><h2 id="literacy-example">Een overtuigend antwoord is nog geen goed antwoord.</h2><p>Je team krijgt een fictieve klantmail die door AI is voorbereid. De tekst leest soepel, maar noemt een levertijd die nergens is afgesproken.</p></div>
          <div className="ws-literacy-example"><p className="ws-context">Oefening · klantcommunicatie</p><ol><li>Vergelijk de tekst met de oorspronkelijke vraag en afspraken.</li><li>Markeer feiten, aannames en ontbrekende informatie.</li><li>Verbeter de tekst en bepaal wie hem mag versturen.</li></ol><p><strong>De werkafspraak:</strong> een medewerker controleert toezeggingen en klantgegevens voordat een bericht naar buiten gaat.</p></div>
        </div>
      </section>

      <section className="ws-literacy-section ws-literacy-section--dark" id="lezing" aria-labelledby="literacy-talk">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Lezing of presentatie</p><h2 id="literacy-talk">Eerst een gedeeld vertrekpunt.</h2></div>
          <div><p>Voor een teamdag, directiebijeenkomst of ondernemersgroep. In zestig minuten bespreken we herkenbare mogelijkheden, veelvoorkomende fouten en eerste afspraken, inclusief tijd voor vragen.</p><p>Je ontvangt een naslagblad. Met de organisator bespreken we binnen tien werkdagen de vragen en gewenste vervolgstap. Een lezing geeft inzicht; de teamtraining voegt begeleid oefenen en een gebruikscontrole toe.</p><p>De prijs en groepsgrootte spreken we vooraf af.</p><Link className="ws-button" href={LITERACY_REQUEST_PATH}>Bespreek een lezing</Link></div>
        </div>
      </section>

      <section className="ws-literacy-section" aria-labelledby="literacy-rules">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">AI-geletterdheid en de AI Act</p><h2 id="literacy-rules">Wat vraagt de verplichting van jouw organisatie?</h2></div>
          <div><p>AI-geletterdheid gaat over kennis, vaardigheden en begrip om verantwoord met AI te werken. De aanpak moet passen bij de mensen, de toepassingen en de risico&apos;s in je organisatie.</p><p>Een cursus of deelnamebewijs is geen automatische garantie op naleving. Setpiece helpt met de praktische invulling: leren, afspraken maken en het gebruik bespreken. Juridische beoordeling valt buiten de training.</p><Link className="ws-text-link" href={LITERACY_ARTICLE_PATH}>Lees wat artikel 4 wel en niet vraagt</Link></div>
        </div>
      </section>

      <section className="ws-literacy-section ws-literacy-section--mist" aria-labelledby="literacy-delivery">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Een duidelijke afbakening</p><h2 id="literacy-delivery">Wat je ontvangt. Wat je zelf organiseert.</h2><p>Je krijgt oefenmateriaal, een overzicht van behandelde onderwerpen en deelname, conceptwerkafspraken en één gebruiksgesprek. De begin- en eindcontrole zijn onderdeel van onze kwaliteitsaanpak.</p><p>De training wordt verzorgd door <Link href="/over">Nathan Sudmeier</Link>, oprichter van Setpiece. Zijn werk richt zich op het verbeteren en invoeren van dagelijkse werkwijzen.</p></div>
          <div><ul className="ws-literacy-list"><li>Je wijst een verantwoordelijke aan die de afspraken vaststelt.</li><li>Deelnemers krijgen tijd om te oefenen en toe te passen.</li><li>Je zorgt voor laptops en vooraf goedgekeurde hulpmiddelen.</li><li>We werken met fictieve of aantoonbaar vrijgegeven voorbeelden.</li><li>Implementatie, juridisch advies en onbeperkte nazorg vallen buiten de opdracht.</li></ul><p>Wil je een volledig proces verbeteren? Daarvoor is de <Link href="/kansenscan">betaalde kansenscan</Link> de eerste stap. De training kun je zelfstandig afnemen.</p></div>
        </div>
      </section>

      <section className="ws-faq-section" aria-labelledby="literacy-faq">
        <div className="ws-frame ws-faq-grid"><div><p className="ws-context">Veelgestelde vragen</p><h2 id="literacy-faq">Duidelijk vóór je een training boekt.</h2></div><FaqList items={LITERACY_FAQ} /></div>
      </section>
      <ClosingCta title="Wat heeft jouw team nodig om verantwoord verder te kunnen?" body="In een kort gesprek bepalen we of een teamtraining of lezing past. Je ontvangt vooraf een afgebakend voorstel. Nathan reageert binnen twee werkdagen." href={LITERACY_REQUEST_PATH} label="Bespreek AI-geletterdheid" />
    </WorkspoorShell>
  );
}
