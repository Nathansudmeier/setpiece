import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import {
  LITERACY_ARTICLE_PATH,
  LITERACY_REVIEW_DATE,
} from "@/lib/ai-geletterdheid";
import { createPageMetadata, PERSON_ID, SITE_URL } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";
const title = "AI-geletterdheid verplicht: wat moeten bedrijven regelen?";
const description =
  "Wat vraagt artikel 4 van de AI Act? Lees voor wie AI-geletterdheid geldt, waarom een certificaat geen garantie is en hoe je praktisch begint.";
const baseMetadata = {
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
    images: [
      {
        url: "/ai-geletterdheid/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI-geletterdheid voor dagelijks werk | Setpiece",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title,
    description,
    images: ["/ai-geletterdheid/opengraph-image"],
  },
};
export async function generateMetadata() {
  return cmsMetadata("kennis-ai-geletterdheid-verplicht", baseMetadata);
}
export async function CmsKennisAiGeletterdheidVerplicht({
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
    LITERACY_PATH,
    LITERACY_REVIEW_DATE,
    LITERACY_SOURCES,
  } = sharedContent(sharedCopy);
  const title =
    copy.v2_tekst_001 ??
    "AI-geletterdheid verplicht: wat moeten bedrijven regelen?";
  const description =
    copy.v2_tekst_002 ??
    "Wat vraagt artikel 4 van de AI Act? Lees voor wie AI-geletterdheid geldt, waarom een certificaat geen garantie is en hoe je praktisch begint.";

  const url = new URL(LITERACY_ARTICLE_PATH, SITE_URL).toString();
  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath={LITERACY_ARTICLE_PATH}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: title,
              description,
              mainEntityOfPage: url,
              datePublished: LITERACY_REVIEW_DATE,
              dateModified: LITERACY_REVIEW_DATE,
              inLanguage: "nl-NL",
              image: new URL(
                "/ai-geletterdheid/opengraph-image",
                SITE_URL,
              ).toString(),
              author: {
                "@id": PERSON_ID,
                "@type": "Person",
                name: "Nathan Sudmeier",
                url: new URL("/over", SITE_URL).toString(),
              },
              publisher: { "@id": `${SITE_URL}#organization` },
              citation: Object.values(LITERACY_SOURCES),
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
                  name: "Kennis",
                  item: new URL("/kennis", SITE_URL).toString(),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Wat is verplicht?",
                  item: url,
                },
              ],
            },
          ],
        }}
      />
      <article>
        <header className="ws-page-hero ws-literacy-article-hero">
          <div className="ws-frame">
            <nav className="ws-breadcrumb" aria-label="Broodkruimel">
              <Link href="/">{copy.v2_tekst_003 ?? "Home"}</Link>
              <span aria-hidden="true">{copy.v2_tekst_004 ?? "/"}</span>
              <Link href={copy.v2_link_005 ?? "/kennis"}>
                {copy.v2_tekst_006 ?? "Kennis"}
              </Link>
              <span aria-hidden="true">{copy.v2_tekst_007 ?? "/"}</span>
              <span>{copy.v2_tekst_008 ?? "Wat is verplicht?"}</span>
            </nav>
            <p className="ws-context">
              {copy.v2_tekst_009 ?? "Uitleg voor werkgevers"}
            </p>
            <h1>{title}</h1>
            <p className="ws-lead">
              {copy.v2_tekst_010 ??
                "Organisaties die AI aanbieden of gebruiken moeten maatregelen nemen om AI-geletterdheid te ondersteunen. Een verplichte standaardcursus voor iedere medewerker bestaat niet. De aanpak hangt samen met het werk, de mensen en de gebruikte systemen."}
            </p>
            <p className="ws-legal-updated">
              {copy.v2_tekst_011 ?? "Door "}
              <Link href={copy.v2_link_012 ?? "/over"}>
                {copy.v2_tekst_013 ?? "Nathan Sudmeier"}
              </Link>{" "}
              {copy.v2_tekst_014 ?? "· Gecontroleerd op "}
              <time dateTime={LITERACY_REVIEW_DATE}>
                {copy.v2_tekst_015 ?? "25 september 2026"}
              </time>
            </p>
          </div>
        </header>
        <div className="ws-legal-section">
          <div className="ws-frame ws-legal-layout">
            <aside className="ws-legal-summary">
              <h2>{copy.v2_tekst_016 ?? "In dit artikel"}</h2>
              <ul>
                <li>
                  <a href="#verplichting">
                    {copy.v2_tekst_017 ?? "Voor wie geldt het?"}
                  </a>
                </li>
                <li>
                  <a href="#cursus">
                    {copy.v2_tekst_018 ?? "Cursus of certificaat?"}
                  </a>
                </li>
                <li>
                  <a href="#beginnen">
                    {copy.v2_tekst_019 ?? "Praktisch beginnen"}
                  </a>
                </li>
                <li>
                  <a href="#voorbeeld">
                    {copy.v2_tekst_020 ?? "Voorbeeld uit het werk"}
                  </a>
                </li>
                <li>
                  <a href="#bronnen">
                    {copy.v2_tekst_021 ?? "Bronnen en grenzen"}
                  </a>
                </li>
              </ul>
            </aside>
            <div className="ws-legal-content">
              <section id="verplichting">
                <h2>
                  {copy.v2_tekst_022 ?? "Voor wie geldt AI-geletterdheid?"}
                </h2>
                <p>
                  {copy.v2_tekst_023 ??
                    "Artikel 4 van de AI-verordening geldt sinds 2 februari 2025. Het richt zich op aanbieders en organisaties die AI-systemen gebruiken. Het betreft personeel en anderen die namens hen met die systemen werken. Ook alledaags gebruik van een AI-assistent kan relevant zijn."}
                </p>
                <p>
                  {copy.v2_tekst_024 ??
                    "Volgens de actuele uitleg van de Europese Commissie is artikel 4 in juli 2026 gewijzigd. De organisatie moet de ontwikkeling van AI-geletterdheid ondersteunen, zonder een bepaald individueel kennisniveau te hoeven garanderen. Houd rekening met voorkennis, ervaring, toepassing en betrokken personen. "}
                  <a href={LITERACY_SOURCES.commission}>
                    {copy.v2_tekst_025 ??
                      "Lees de actuele uitleg van de Commissie."}
                  </a>
                </p>
              </section>
              <section id="cursus">
                <h2>
                  {copy.v2_tekst_026 ??
                    "Is een cursus of certificaat verplicht?"}
                </h2>
                <p>
                  {copy.v2_tekst_027 ??
                    "Er is geen algemeen voorgeschreven cursusformat, examen of certificaat. Een deelnamebewijs geeft ook geen automatische zekerheid dat de hele organisatie aan de AI-verordening voldoet. Bij bijzondere toepassingen kunnen aanvullende eisen gelden. "}
                  <a href={LITERACY_SOURCES.commission}>
                    {copy.v2_tekst_028 ??
                      "Bron: vragen en antwoorden over AI-geletterdheid."}
                  </a>
                </p>
                <p>
                  {copy.v2_tekst_029 ??
                    "Kies de werkvorm die past bij wat mensen moeten kunnen. Een presentatie kan een gesprek openen. Een team dat dagelijks uitkomsten gebruikt, heeft ook baat bij oefenen, controle en duidelijke afspraken. Een directeur heeft andere vragen dan iemand die dagelijks klantteksten voorbereidt."}
                </p>
              </section>
              <section id="beginnen">
                <h2>{copy.v2_tekst_030 ?? "Hoe begin je als werkgever?"}</h2>
                <p>
                  {copy.v2_tekst_031 ??
                    "De Autoriteit Persoonsgegevens benadrukt een structurele aanpak met inventarisatie, doelen, uitvoering en evaluatie. Onderstaande stappen zijn een praktische vertaling voor een klein of middelgroot team. "}
                  <a href={LITERACY_SOURCES.authority}>
                    {copy.v2_tekst_032 ?? "Bekijk de AP-handreiking."}
                  </a>
                </p>
                <ol>
                  <li>
                    <strong>
                      {copy.v2_tekst_033 ?? "Breng het gebruik in beeld."}
                    </strong>{" "}
                    {copy.v2_tekst_034 ??
                      "Welke hulpmiddelen worden voor welke taken gebruikt? Kijk ook naar losse experimenten en inzet door externe medewerkers."}
                  </li>
                  <li>
                    <strong>
                      {copy.v2_tekst_035 ?? "Kies een verantwoordelijke."}
                    </strong>{" "}
                    {copy.v2_tekst_036 ??
                      "Iemand moet afspraken vaststellen, vragen beantwoorden en wijzigingen bijhouden."}
                  </li>
                  <li>
                    <strong>
                      {copy.v2_tekst_037 ?? "Bepaal wat mensen moeten leren."}
                    </strong>{" "}
                    {copy.v2_tekst_038 ??
                      "Werk vanuit functie, ervaring, gegevens en gevolgen van een fout."}
                  </li>
                  <li>
                    <strong>
                      {copy.v2_tekst_039 ?? "Laat medewerkers oefenen."}
                    </strong>{" "}
                    {copy.v2_tekst_040 ??
                      "Gebruik herkenbare taken en veilige voorbeelden. Bespreek ook wanneer zij een uitkomst niet moeten gebruiken."}
                  </li>
                  <li>
                    <strong>
                      {copy.v2_tekst_041 ??
                        "Leg afspraken en activiteiten vast."}
                    </strong>{" "}
                    {copy.v2_tekst_042 ??
                      "Noteer onderwerpen, deelnemers, toegestane hulpmiddelen en vervolgacties. Bewaar alleen noodzakelijke persoonsgegevens."}
                  </li>
                  <li>
                    <strong>
                      {copy.v2_tekst_043 ?? "Bespreek het gebruik opnieuw."}
                    </strong>{" "}
                    {copy.v2_tekst_044 ??
                      "Nieuwe medewerkers, andere systemen of terugkerende fouten kunnen extra uitleg nodig maken."}
                  </li>
                </ol>
                <p>
                  {copy.v2_tekst_045 ??
                    "Setpiece gebruikt een begin- en eindcontrole om de training te verbeteren. Dat is onze kwaliteitskeuze, geen wettelijk voorgeschreven examen."}
                </p>
              </section>
              <section id="voorbeeld">
                <h2>
                  {copy.v2_tekst_046 ??
                    "Voorbeeld: een klantmail voorbereiden met AI"}
                </h2>
                <p>
                  {copy.v2_tekst_047 ??
                    "Een medewerker laat AI een antwoord op een klantvraag opstellen. Het concept klinkt professioneel, maar bevat een verzonnen toezegging. De vaardigheid zit dan niet alleen in het schrijven van de opdracht. De medewerker moet de fout herkennen, teruggaan naar de oorspronkelijke afspraken en de toezegging verwijderen."}
                </p>
                <p>
                  {copy.v2_tekst_048 ??
                    "Een bruikbare teamafspraak beschrijft daarom welk account is toegestaan, welke informatie mag worden ingevoerd, wat wordt gecontroleerd en wie het definitieve bericht verstuurt. Zo wordt kennis onderdeel van het werk."}
                </p>
                <p>
                  {copy.v2_tekst_049 ?? "In onze "}
                  <Link href={LITERACY_PATH}>
                    {copy.v2_tekst_050 ?? "teamtraining AI-geletterdheid"}
                  </Link>{" "}
                  {copy.v2_tekst_051 ??
                    "oefenen medewerkers met twee vooraf gekozen werksituaties. Daarna legt het team afspraken vast en bespreken we na ongeveer dertig dagen het gebruik."}
                </p>
              </section>
              <section id="bronnen">
                <h2>
                  {copy.v2_tekst_052 ?? "Bronnen en grenzen van deze uitleg"}
                </h2>
                <ul>
                  <li>
                    <a href={LITERACY_SOURCES.commission}>
                      {copy.v2_tekst_053 ??
                        "Europese Commissie: AI Literacy, Questions & Answers"}
                    </a>
                    {copy.v2_tekst_054 ??
                      ", met actuele uitleg over de wijziging van artikel 4."}
                  </li>
                  <li>
                    <a href={LITERACY_SOURCES.policy}>
                      {copy.v2_tekst_055 ??
                        "Europese Commissie: AI talent, skills and literacy"}
                    </a>
                    {copy.v2_tekst_056 ?? "."}
                  </li>
                  <li>
                    <a href={LITERACY_SOURCES.authority}>
                      {copy.v2_tekst_057 ??
                        "Autoriteit Persoonsgegevens: Verder bouwen aan AI-geletterdheid"}
                    </a>
                    {copy.v2_tekst_058 ??
                      ", 23 oktober 2025; gebruikt voor de praktische aanpak."}
                  </li>
                </ul>
                <p>
                  {copy.v2_tekst_059 ??
                    "Dit artikel biedt algemene uitleg en is geen juridische beoordeling van jouw organisatie. Oudere handreikingen kunnen nog de eerdere wettekst beschrijven. Laat vragen over risicoclassificatie, personeelsbesluiten of andere gevoelige toepassingen beoordelen door een passende deskundige."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </article>
      <ClosingCta
        sharedCopy={sharedCopy}
        title={copy.v2_tekst_060 ?? "Van uitleg naar werkbare afspraken."}
        body={
          copy.v2_tekst_061 ??
          "Bekijk hoe Setpiece jouw team begeleidt met een praktische training, oefenmateriaal en opvolging."
        }
        href={LITERACY_PATH}
        label={copy.v2_tekst_062 ?? "Bekijk de teamtraining"}
      />
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("kennis-ai-geletterdheid-verplicht"),
    readPublished("shared"),
  ]);
  return (
    <CmsKennisAiGeletterdheidVerplicht copy={copy} sharedCopy={sharedCopy} />
  );
}
