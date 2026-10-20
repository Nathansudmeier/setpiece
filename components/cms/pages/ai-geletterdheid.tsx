import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { LITERACY_DESCRIPTION, LITERACY_PATH } from "@/lib/ai-geletterdheid";
import { createPageMetadata, SITE_URL } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";

const baseMetadata = createPageMetadata({
  title: "Training AI-geletterdheid voor bedrijven",
  description: LITERACY_DESCRIPTION,
  path: LITERACY_PATH,
});
export async function generateMetadata() {
  return cmsMetadata("ai-geletterdheid", baseMetadata);
}
export async function CmsAiGeletterdheid({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const {
    LITERACY_ARTICLE_PATH,
    LITERACY_DESCRIPTION,
    LITERACY_FAQ,
    LITERACY_PATH,
    LITERACY_REQUEST_PATH,
  } = sharedContent(sharedCopy);
  const OUTCOMES = [
    [
      copy.v2_tekst_001 ?? "Beter beoordelen",
      copy.v2_tekst_002 ??
        "Medewerkers herkennen fouten en onzekerheid in AI-antwoorden. Ze controleren bronnen voordat ze een uitkomst gebruiken.",
    ],
    [
      copy.v2_tekst_003 ?? "Veiliger werken",
      copy.v2_tekst_004 ??
        "Je team weet welke hulpmiddelen en gegevens het mag gebruiken, wie controleert en wanneer het hulp vraagt.",
    ],
    [
      copy.v2_tekst_005 ?? "Samen verder",
      copy.v2_tekst_006 ??
        "Je houdt werkafspraken, oefenmateriaal en een verantwoordelijke over. Na dertig dagen bespreken we wat werkelijk wordt toegepast.",
    ],
  ] as const;
  const STEPS = [
    [
      copy.v2_tekst_007 ?? "Voorbereiden",
      copy.v2_tekst_008 ??
        "In dertig minuten bespreken we doel, startniveau en hulpmiddelen. We kiezen twee herkenbare werksituaties.",
    ],
    [
      copy.v2_tekst_009 ?? "Oefenen",
      copy.v2_tekst_010 ??
        "Een sessie van drie uur voor maximaal twaalf deelnemers. Van een goede opdracht tot een gecontroleerde uitkomst.",
    ],
    [
      copy.v2_tekst_011 ?? "Vastleggen",
      copy.v2_tekst_012 ??
        "Binnen vijf werkdagen ontvang je materiaal en conceptwerkafspraken. De opdrachtgever stelt de afspraken vast.",
    ],
    [
      copy.v2_tekst_013 ?? "Toepassen",
      copy.v2_tekst_014 ??
        "Na ongeveer dertig dagen volgt een online gebruiksgesprek van 45 minuten. We bespreken leerpunten en vervolg.",
    ],
  ] as const;

  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath={LITERACY_PATH}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${SITE_URL}ai-geletterdheid#service`,
              name: "Training AI-geletterdheid voor bedrijven",
              serviceType:
                "Teamtraining AI-geletterdheid met opvolging en lezingen",
              description: LITERACY_DESCRIPTION,
              url: new URL(LITERACY_PATH, SITE_URL).toString(),
              provider: { "@id": `${SITE_URL}#organization` },
              areaServed: { "@type": "Country", name: "Nederland" },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL.toString(),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "AI-geletterdheid",
                  item: new URL(LITERACY_PATH, SITE_URL).toString(),
                },
              ],
            },
          ],
        }}
      />

      <section className="ws-page-hero ws-literacy-hero">
        <div className="ws-frame ws-page-hero__grid">
          <div>
            <nav className="ws-breadcrumb" aria-label="Broodkruimel">
              <Link href="/">{copy.v2_tekst_015 ?? "Home"}</Link>
              <span aria-hidden="true">{copy.v2_tekst_016 ?? "/"}</span>
              <span>{copy.v2_tekst_017 ?? "AI-geletterdheid"}</span>
            </nav>
            <p className="ws-context">
              {copy.v2_tekst_018 ?? "AI-geletterdheid voor bedrijven"}
            </p>
            <h1>
              {copy.v2_tekst_019 ?? "Je team gebruikt AI."}
              <br />
              {copy.v2_tekst_020 ?? "Nu met kennis en duidelijke afspraken."}
            </h1>
            <p className="ws-lead">
              {copy.v2_tekst_021 ??
                "Een praktische training AI-geletterdheid rond jullie dagelijkse werk. Medewerkers leren oefenen, controleren en verantwoord beslissen. Met werkafspraken en opvolging na dertig dagen."}
            </p>
            <div className="ws-inline-actions">
              <Link className="ws-button" href={LITERACY_REQUEST_PATH}>
                {copy.v2_tekst_022 ?? "Bespreek de teamtraining"}
              </Link>
              <a className="ws-text-link" href="#programma">
                {copy.v2_tekst_023 ?? "Bekijk het programma"}
              </a>
            </div>
          </div>
          <aside
            className="ws-literacy-summary"
            aria-label="De training in het kort"
          >
            <p className="ws-context">
              {copy.v2_tekst_024 ?? "Van weten naar doen"}
            </p>
            <dl>
              <div>
                <dt>{copy.v2_tekst_025 ?? "3 uur"}</dt>
                <dd>{copy.v2_tekst_026 ?? "praktisch oefenen met je team"}</dd>
              </div>
              <div>
                <dt>{copy.v2_tekst_027 ?? "Max. 12"}</dt>
                <dd>{copy.v2_tekst_028 ?? "deelnemers per groep"}</dd>
              </div>
              <div>
                <dt>{copy.v2_tekst_029 ?? "Na 30 dagen"}</dt>
                <dd>{copy.v2_tekst_030 ?? "samen het gebruik bespreken"}</dd>
              </div>
            </dl>
            <p>
              {copy.v2_tekst_031 ??
                "Op locatie of live online. Prijs op aanvraag, met een vaste offerte vooraf."}
            </p>
            <a className="ws-text-link" href="#lezing">
              {copy.v2_tekst_032 ?? "Ook als lezing of presentatie"}
            </a>
          </aside>
        </div>
      </section>

      <section
        className="ws-literacy-section"
        aria-labelledby="literacy-result"
      >
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>{copy.v2_tekst_033 ?? "Voor medewerkers én leidinggevenden"}</p>
            <h2 id="literacy-result">
              {copy.v2_tekst_034 ?? "Meer grip op wat je team met AI doet."}
            </h2>
          </div>
          <div className="ws-literacy-outcomes">
            {OUTCOMES.map(([title, text], index) => (
              <article key={title}>
                <span className="ws-literacy-number">
                  {copy.v2_tekst_035 ?? "0"}
                  {index + 1}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="ws-literacy-section ws-literacy-section--mist"
        id="programma"
        aria-labelledby="literacy-programme"
      >
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_036 ?? "Teamtraining met opvolging"}
            </p>
            <h2 id="literacy-programme">
              {copy.v2_tekst_037 ??
                "Leren aan de hand van het werk dat er al ligt."}
            </h2>
            <p>
              {copy.v2_tekst_038 ??
                "Een klantmail, offertevoorbereiding of samenvatting. We kiezen vooraf twee werksituaties die jouw team herkent. Je hoeft geen technische voorkennis te hebben."}
            </p>
            <p>
              {copy.v2_tekst_039 ??
                "We behandelen wat AI kan en waar het misgaat: onjuiste informatie, vooroordelen, privacy en te veel vertrouwen in een antwoord. Medewerkers oefenen met opdrachten formuleren, bronnen controleren en zelf beslissen."}
            </p>
          </div>
          <ol className="ws-literacy-steps">
            {STEPS.map(([title, text], index) => (
              <li key={title}>
                <span aria-hidden="true">
                  {copy.v2_tekst_040 ?? "0"}
                  {index + 1}
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="ws-literacy-section"
        aria-labelledby="literacy-example"
      >
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_041 ?? "Zo ziet oefenen eruit"}
            </p>
            <h2 id="literacy-example">
              {copy.v2_tekst_042 ??
                "Een overtuigend antwoord is nog geen goed antwoord."}
            </h2>
            <p>
              {copy.v2_tekst_043 ??
                "Je team krijgt een fictieve klantmail die door AI is voorbereid. De tekst leest soepel, maar noemt een levertijd die nergens is afgesproken."}
            </p>
          </div>
          <div className="ws-literacy-example">
            <p className="ws-context">
              {copy.v2_tekst_044 ?? "Oefening · klantcommunicatie"}
            </p>
            <ol>
              <li>
                {copy.v2_tekst_045 ??
                  "Vergelijk de tekst met de oorspronkelijke vraag en afspraken."}
              </li>
              <li>
                {copy.v2_tekst_046 ??
                  "Markeer feiten, aannames en ontbrekende informatie."}
              </li>
              <li>
                {copy.v2_tekst_047 ??
                  "Verbeter de tekst en bepaal wie hem mag versturen."}
              </li>
            </ol>
            <p>
              <strong>{copy.v2_tekst_048 ?? "De werkafspraak:"}</strong>{" "}
              {copy.v2_tekst_049 ??
                "een medewerker controleert toezeggingen en klantgegevens voordat een bericht naar buiten gaat."}
            </p>
          </div>
        </div>
      </section>

      <section
        className="ws-literacy-section ws-literacy-section--dark"
        id="lezing"
        aria-labelledby="literacy-talk"
      >
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_050 ?? "Lezing of presentatie"}
            </p>
            <h2 id="literacy-talk">
              {copy.v2_tekst_051 ?? "Eerst een gedeeld vertrekpunt."}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_052 ??
                "Voor een teamdag, directiebijeenkomst of ondernemersgroep. In zestig minuten bespreken we herkenbare mogelijkheden, veelvoorkomende fouten en eerste afspraken, inclusief tijd voor vragen."}
            </p>
            <p>
              {copy.v2_tekst_053 ??
                "Je ontvangt een naslagblad. Met de organisator bespreken we binnen tien werkdagen de vragen en gewenste vervolgstap. Een lezing geeft inzicht; de teamtraining voegt begeleid oefenen en een gebruikscontrole toe."}
            </p>
            <p>
              {copy.v2_tekst_054 ??
                "De prijs en groepsgrootte spreken we vooraf af."}
            </p>
            <Link className="ws-button" href={LITERACY_REQUEST_PATH}>
              {copy.v2_tekst_055 ?? "Bespreek een lezing"}
            </Link>
          </div>
        </div>
      </section>

      <section className="ws-literacy-section" aria-labelledby="literacy-rules">
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_056 ?? "AI-geletterdheid en de AI Act"}
            </p>
            <h2 id="literacy-rules">
              {copy.v2_tekst_057 ??
                "Wat vraagt de verplichting van jouw organisatie?"}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_058 ??
                "AI-geletterdheid gaat over kennis, vaardigheden en begrip om verantwoord met AI te werken. De aanpak moet passen bij de mensen, de toepassingen en de risico's in je organisatie."}
            </p>
            <p>
              {copy.v2_tekst_059 ??
                "Een cursus of deelnamebewijs is geen automatische garantie op naleving. Setpiece helpt met de praktische invulling: leren, afspraken maken en het gebruik bespreken. Juridische beoordeling valt buiten de training."}
            </p>
            <Link className="ws-text-link" href={LITERACY_ARTICLE_PATH}>
              {copy.v2_tekst_060 ?? "Lees wat artikel 4 wel en niet vraagt"}
            </Link>
          </div>
        </div>
      </section>

      <section
        className="ws-literacy-section ws-literacy-section--mist"
        aria-labelledby="literacy-delivery"
      >
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_061 ?? "Een duidelijke afbakening"}
            </p>
            <h2 id="literacy-delivery">
              {copy.v2_tekst_062 ?? "Wat je ontvangt. Wat je zelf organiseert."}
            </h2>
            <p>
              {copy.v2_tekst_063 ??
                "Je krijgt oefenmateriaal, een overzicht van behandelde onderwerpen en deelname, conceptwerkafspraken en één gebruiksgesprek. De begin- en eindcontrole zijn onderdeel van onze kwaliteitsaanpak."}
            </p>
            <p>
              {copy.v2_tekst_064 ?? "De training wordt verzorgd door "}
              <Link href={copy.v2_link_065 ?? "/over"}>
                {copy.v2_tekst_066 ?? "Nathan Sudmeier"}
              </Link>
              {copy.v2_tekst_067 ??
                ", oprichter van Setpiece. Zijn werk richt zich op het verbeteren en invoeren van dagelijkse werkwijzen."}
            </p>
          </div>
          <div>
            <ul className="ws-literacy-list">
              <li>
                {copy.v2_tekst_068 ??
                  "Je wijst een verantwoordelijke aan die de afspraken vaststelt."}
              </li>
              <li>
                {copy.v2_tekst_069 ??
                  "Deelnemers krijgen tijd om te oefenen en toe te passen."}
              </li>
              <li>
                {copy.v2_tekst_070 ??
                  "Je zorgt voor laptops en vooraf goedgekeurde hulpmiddelen."}
              </li>
              <li>
                {copy.v2_tekst_071 ??
                  "We werken met fictieve of aantoonbaar vrijgegeven voorbeelden."}
              </li>
              <li>
                {copy.v2_tekst_072 ??
                  "Implementatie, juridisch advies en onbeperkte nazorg vallen buiten de opdracht."}
              </li>
            </ul>
            <p>
              {copy.v2_tekst_073 ??
                "Wil je een volledig proces verbeteren? Daarvoor is de "}
              <Link href={copy.v2_link_074 ?? "/kansenscan"}>
                {copy.v2_tekst_075 ?? "betaalde kansenscan"}
              </Link>{" "}
              {copy.v2_tekst_076 ??
                "de eerste stap. De training kun je zelfstandig afnemen."}
            </p>
          </div>
        </div>
      </section>

      <section className="ws-faq-section" aria-labelledby="literacy-faq">
        <div className="ws-frame ws-faq-grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_077 ?? "Veelgestelde vragen"}
            </p>
            <h2 id="literacy-faq">
              {copy.v2_tekst_078 ?? "Duidelijk vóór je een training boekt."}
            </h2>
          </div>
          <FaqList items={LITERACY_FAQ} />
        </div>
      </section>
      <ClosingCta
        sharedCopy={sharedCopy}
        title={
          copy.v2_tekst_079 ??
          "Wat heeft jouw team nodig om verantwoord verder te kunnen?"
        }
        body={
          copy.v2_tekst_080 ??
          "In een kort gesprek bepalen we of een teamtraining of lezing past. Je ontvangt vooraf een afgebakend voorstel. Nathan reageert binnen twee werkdagen."
        }
        href={LITERACY_REQUEST_PATH}
        label={copy.v2_tekst_081 ?? "Bespreek AI-geletterdheid"}
      />
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("ai-geletterdheid"),
    readPublished("shared"),
  ]);
  return <CmsAiGeletterdheid copy={copy} sharedCopy={sharedCopy} />;
}
