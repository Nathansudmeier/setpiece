import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { LITERACY_ARTICLE_PATH, LITERACY_PATH, LITERACY_REVIEW_DATE, LITERACY_SOURCES } from "@/lib/ai-geletterdheid";
import { createPageMetadata, PERSON_ID, SITE_URL } from "@/lib/seo";

const title = "AI-geletterdheid verplicht: wat moeten bedrijven regelen?";
const description = "Wat vraagt artikel 4 van de AI Act? Lees voor wie AI-geletterdheid geldt, waarom een certificaat geen garantie is en hoe je praktisch begint.";

export const metadata = {
  ...createPageMetadata({ title, description, path: LITERACY_ARTICLE_PATH }),
  openGraph: {
    type: "article" as const,
    title: `${title} | Setpiece`,
    description,
    url: LITERACY_ARTICLE_PATH,
    locale: "nl_NL",
    siteName: "Setpiece",
    publishedTime: LITERACY_REVIEW_DATE,
    modifiedTime: LITERACY_REVIEW_DATE,
    images: [{ url: "/ai-geletterdheid/opengraph-image", width: 1200, height: 630, alt: "AI-geletterdheid voor dagelijks werk | Setpiece" }],
  },
  twitter: { card: "summary_large_image" as const, title, description, images: ["/ai-geletterdheid/opengraph-image"] },
};

export default function LiteracyArticlePage() {
  const url = new URL(LITERACY_ARTICLE_PATH, SITE_URL).toString();
  return (
    <WorkspoorShell activePath={LITERACY_ARTICLE_PATH}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Article", "@id": `${url}#article`, headline: title, description, mainEntityOfPage: url, datePublished: LITERACY_REVIEW_DATE, dateModified: LITERACY_REVIEW_DATE, inLanguage: "nl-NL", image: new URL("/ai-geletterdheid/opengraph-image", SITE_URL).toString(), author: { "@id": PERSON_ID, "@type": "Person", name: "Nathan Sudmeier", url: new URL("/over", SITE_URL).toString() }, publisher: { "@id": `${SITE_URL}#organization` }, citation: Object.values(LITERACY_SOURCES) },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL.toString() },
            { "@type": "ListItem", position: 2, name: "Kennis", item: new URL("/kennis", SITE_URL).toString() },
            { "@type": "ListItem", position: 3, name: "Wat is verplicht?", item: url },
          ] },
        ],
      }} />
      <article>
        <header className="ws-page-hero ws-literacy-article-hero">
          <div className="ws-frame">
            <nav className="ws-breadcrumb" aria-label="Broodkruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/kennis">Kennis</Link><span aria-hidden="true">/</span><span>Wat is verplicht?</span></nav>
            <p className="ws-context">Uitleg voor werkgevers</p>
            <h1>{title}</h1>
            <p className="ws-lead">Organisaties die AI aanbieden of gebruiken moeten maatregelen nemen om AI-geletterdheid te ondersteunen. Een verplichte standaardcursus voor iedere medewerker bestaat niet. De aanpak hangt samen met het werk, de mensen en de gebruikte systemen.</p>
            <p className="ws-legal-updated">Door <Link href="/over">Nathan Sudmeier</Link> · Gecontroleerd op <time dateTime={LITERACY_REVIEW_DATE}>25 september 2026</time></p>
          </div>
        </header>
        <div className="ws-legal-section">
          <div className="ws-frame ws-legal-layout">
            <aside className="ws-legal-summary"><h2>In dit artikel</h2><ul><li><a href="#verplichting">Voor wie geldt het?</a></li><li><a href="#cursus">Cursus of certificaat?</a></li><li><a href="#beginnen">Praktisch beginnen</a></li><li><a href="#voorbeeld">Voorbeeld uit het werk</a></li><li><a href="#bronnen">Bronnen en grenzen</a></li></ul></aside>
            <div className="ws-legal-content">
              <section id="verplichting"><h2>Voor wie geldt AI-geletterdheid?</h2><p>Artikel 4 van de AI-verordening geldt sinds 2 februari 2025. Het richt zich op aanbieders en organisaties die AI-systemen gebruiken. Het betreft personeel en anderen die namens hen met die systemen werken. Ook alledaags gebruik van een AI-assistent kan relevant zijn.</p><p>Volgens de actuele uitleg van de Europese Commissie is artikel 4 in juli 2026 gewijzigd. De organisatie moet de ontwikkeling van AI-geletterdheid ondersteunen, zonder een bepaald individueel kennisniveau te hoeven garanderen. Houd rekening met voorkennis, ervaring, toepassing en betrokken personen. <a href={LITERACY_SOURCES.commission}>Lees de actuele uitleg van de Commissie.</a></p></section>
              <section id="cursus"><h2>Is een cursus of certificaat verplicht?</h2><p>Er is geen algemeen voorgeschreven cursusformat, examen of certificaat. Een deelnamebewijs geeft ook geen automatische zekerheid dat de hele organisatie aan de AI-verordening voldoet. Bij bijzondere toepassingen kunnen aanvullende eisen gelden. <a href={LITERACY_SOURCES.commission}>Bron: vragen en antwoorden over AI-geletterdheid.</a></p><p>Kies de werkvorm die past bij wat mensen moeten kunnen. Een presentatie kan een gesprek openen. Een team dat dagelijks uitkomsten gebruikt, heeft ook baat bij oefenen, controle en duidelijke afspraken. Een directeur heeft andere vragen dan iemand die dagelijks klantteksten voorbereidt.</p></section>
              <section id="beginnen"><h2>Hoe begin je als werkgever?</h2><p>De Autoriteit Persoonsgegevens benadrukt een structurele aanpak met inventarisatie, doelen, uitvoering en evaluatie. Onderstaande stappen zijn een praktische vertaling voor een klein of middelgroot team. <a href={LITERACY_SOURCES.authority}>Bekijk de AP-handreiking.</a></p><ol><li><strong>Breng het gebruik in beeld.</strong> Welke hulpmiddelen worden voor welke taken gebruikt? Kijk ook naar losse experimenten en inzet door externe medewerkers.</li><li><strong>Kies een verantwoordelijke.</strong> Iemand moet afspraken vaststellen, vragen beantwoorden en wijzigingen bijhouden.</li><li><strong>Bepaal wat mensen moeten leren.</strong> Werk vanuit functie, ervaring, gegevens en gevolgen van een fout.</li><li><strong>Laat medewerkers oefenen.</strong> Gebruik herkenbare taken en veilige voorbeelden. Bespreek ook wanneer zij een uitkomst niet moeten gebruiken.</li><li><strong>Leg afspraken en activiteiten vast.</strong> Noteer onderwerpen, deelnemers, toegestane hulpmiddelen en vervolgacties. Bewaar alleen noodzakelijke persoonsgegevens.</li><li><strong>Bespreek het gebruik opnieuw.</strong> Nieuwe medewerkers, andere systemen of terugkerende fouten kunnen extra uitleg nodig maken.</li></ol><p>Setpiece gebruikt een begin- en eindcontrole om de training te verbeteren. Dat is onze kwaliteitskeuze, geen wettelijk voorgeschreven examen.</p></section>
              <section id="voorbeeld"><h2>Voorbeeld: een klantmail voorbereiden met AI</h2><p>Een medewerker laat AI een antwoord op een klantvraag opstellen. Het concept klinkt professioneel, maar bevat een verzonnen toezegging. De vaardigheid zit dan niet alleen in het schrijven van de opdracht. De medewerker moet de fout herkennen, teruggaan naar de oorspronkelijke afspraken en de toezegging verwijderen.</p><p>Een bruikbare teamafspraak beschrijft daarom welk account is toegestaan, welke informatie mag worden ingevoerd, wat wordt gecontroleerd en wie het definitieve bericht verstuurt. Zo wordt kennis onderdeel van het werk.</p><p>In onze <Link href={LITERACY_PATH}>teamtraining AI-geletterdheid</Link> oefenen medewerkers met twee vooraf gekozen werksituaties. Daarna legt het team afspraken vast en bespreken we na ongeveer dertig dagen het gebruik.</p></section>
              <section id="bronnen"><h2>Bronnen en grenzen van deze uitleg</h2><ul><li><a href={LITERACY_SOURCES.commission}>Europese Commissie: AI Literacy, Questions &amp; Answers</a>, met actuele uitleg over de wijziging van artikel 4.</li><li><a href={LITERACY_SOURCES.policy}>Europese Commissie: AI talent, skills and literacy</a>.</li><li><a href={LITERACY_SOURCES.authority}>Autoriteit Persoonsgegevens: Verder bouwen aan AI-geletterdheid</a>, 23 oktober 2025; gebruikt voor de praktische aanpak.</li></ul><p>Dit artikel biedt algemene uitleg en is geen juridische beoordeling van jouw organisatie. Oudere handreikingen kunnen nog de eerdere wettekst beschrijven. Laat vragen over risicoclassificatie, personeelsbesluiten of andere gevoelige toepassingen beoordelen door een passende deskundige.</p></section>
            </div>
          </div>
        </div>
      </article>
      <ClosingCta title="Van uitleg naar werkbare afspraken." body="Bekijk hoe Setpiece jouw team begeleidt met een praktische training, oefenmateriaal en opvolging." href={LITERACY_PATH} label="Bekijk de teamtraining" />
    </WorkspoorShell>
  );
}
