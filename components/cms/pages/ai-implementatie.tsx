import Link from "next/link";
import ServicePage from "@/components/workspoor/ServicePage";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";

const description =
  "Maak in vier weken maximaal twee samenhangende AI-workflows werkend, getest en overdraagbaar. Voor één bedrijfsprobleem, met medewerkers en menselijke controle.";
const baseMetadata = createPageMetadata({
  title: "AI-implementatie voor het mkb: workflows die werken",
  description,
  path: "/ai-implementatie",
});
export async function generateMetadata() {
  return cmsMetadata("ai-implementatie", baseMetadata);
}
export async function CmsAiImplementatie({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const description =
    copy.v2_tekst_001 ??
    "Maak in vier weken maximaal twee samenhangende AI-workflows werkend, getest en overdraagbaar. Voor één bedrijfsprobleem, met medewerkers en menselijke controle.";

  return (
    <ServicePage
      sharedCopy={sharedCopy}
      preview={preview}
      path="/ai-implementatie"
      name={copy.v2_tekst_002 ?? "AI-implementatiesprint"}
      title={
        copy.v2_tekst_003 ??
        "AI-implementatie die onderdeel wordt van het werk."
      }
      description={description}
      price={copy.v2_tekst_004 ?? "€ 7.500"}
      priceNote={copy.v2_tekst_005 ?? "exclusief btw"}
      term={
        copy.v2_tekst_006 ??
        "Vier weken. Eén bedrijfsprobleem. Maximaal twee samenhangende workflows."
      }
      action={copy.v2_tekst_007 ?? "Bespreek de implementatiesprint"}
      definition={
        <>
          <p>
            {copy.v2_tekst_008 ??
              "AI-implementatie is het inrichten, testen en invoeren van een toepassing in een bestaand werkproces. Bij Setpiece hoort daar ook bij dat medewerkers ermee kunnen werken en dat de klant weet wie controleert en beheert."}
          </p>
          <p>
            {copy.v2_tekst_009 ??
              "De sprint past wanneer de prioriteit helder is. Bijvoorbeeld bij terugkerende rapportage, het voorbereiden van klantcommunicatie of het verzamelen van marktinformatie. Welke toepassing geschikt is, hangt af van jullie proces, gegevens en systemen."}
          </p>
          <p>
            {copy.v2_tekst_010 ??
              "Is nog niet duidelijk waar je verantwoord begint? De "}
            <Link href={copy.v2_link_011 ?? "/kansenscan"}>
              {copy.v2_tekst_012 ?? "AI-kansenscan"}
            </Link>{" "}
            {copy.v2_tekst_013 ??
              "vergelijkt eerst maximaal drie processen en onderbouwt de keuze."}
          </p>
        </>
      }
      included={[
        copy.v2_tekst_014 ?? "Procesontwerp, afbakening en nulmeting.",
        copy.v2_tekst_015 ??
          "Inrichting binnen bestaande systemen waar dat verantwoord is.",
        copy.v2_tekst_016 ??
          "Maximaal twee samenhangende workflows rond één bedrijfsprobleem.",
        copy.v2_tekst_017 ??
          "Praktijktest met echte gebruikers, inclusief uitzonderingen en fouten.",
        copy.v2_tekst_018 ??
          "Menselijke controles, werkinstructie en beheernotitie.",
        copy.v2_tekst_019 ??
          "Overdracht, korte gebruikstraining en eerste effectmeting.",
      ]}
      required={[
        copy.v2_tekst_020 ?? "Eén beslisser en één proceseigenaar.",
        copy.v2_tekst_021 ??
          "Minimaal twee gebruikers die tijd krijgen om te testen.",
        copy.v2_tekst_022 ??
          "Veilige testgegevens en geregelde toegang tot systemen.",
        copy.v2_tekst_023 ??
          "Akkoord op de scope, nulmeting en acceptatiecriteria.",
        copy.v2_tekst_024 ??
          "Een interne eigenaar voor gebruik en beheer na overdracht.",
      ]}
      steps={[
        [
          copy.v2_tekst_025 ?? "Week 1: afbakenen",
          copy.v2_tekst_026 ??
            "We leggen proces, doelen, rollen, controles en acceptatiecriteria vast. De klant geeft akkoord op het ontwerp en testplan.",
        ],
        [
          copy.v2_tekst_027 ?? "Week 2: bouwen",
          copy.v2_tekst_028 ??
            "We richten een testbare versie in met veilige gegevens. Normale situaties, uitzonderingen en foutmeldingen worden gecontroleerd.",
        ],
        [
          copy.v2_tekst_029 ?? "Week 3: testen",
          copy.v2_tekst_030 ??
            "Gebruikers voeren herkenbare taken uit. We beoordelen doorlooptijd, kwaliteit en gebruiksgemak en verwerken noodzakelijke correcties.",
        ],
        [
          copy.v2_tekst_031 ?? "Week 4: overdragen",
          copy.v2_tekst_032 ??
            "We leggen instructies, beheer en terugvalafspraken vast, trainen de betrokkenen en meten het eerste resultaat.",
        ],
      ]}
      exclusions={[
        copy.v2_tekst_033 ??
          "Nieuwe maatwerksoftware, uitgebreide portals en complexe koppelingen.",
        copy.v2_tekst_034 ??
          "Grote gegevensmigraties en juridische beoordeling.",
        copy.v2_tekst_035 ??
          "Nieuwe processen of extra workflows buiten de afgesproken scope.",
        copy.v2_tekst_036 ??
          "Doorlopende contentproductie en onbeperkte wijzigingen.",
      ]}
      faq={[
        {
          question: copy.v2_tekst_037 ?? "Moeten we eerst een kansenscan doen?",
          answer:
            copy.v2_tekst_038 ??
            "De kansenscan is de gebruikelijke eerste stap wanneer de prioriteit nog niet onderbouwd is. Voor een sprint moeten probleem, eigenaar, gegevens en acceptatiecriteria duidelijk zijn. In een kennismaking bespreken we wat al beschikbaar is en welke voorbereiding nodig is.",
        },
        {
          question:
            copy.v2_tekst_039 ?? "Wat kost AI-implementatie bij Setpiece?",
          answer:
            copy.v2_tekst_040 ??
            "De afgebakende implementatiesprint kost € 7.500 exclusief btw. Je betaalt 50 procent bij opdracht en 50 procent bij oplevering. Reiskosten, externe licenties en verbruik worden vooraf benoemd. Start de sprint binnen 30 dagen na de kansenscan, dan wordt € 750 verrekend.",
        },
        {
          question:
            copy.v2_tekst_041 ??
            "Vervangt de workflow het oordeel van medewerkers?",
          answer:
            copy.v2_tekst_042 ??
            "We spreken per proces af wat een toepassing mag voorbereiden en wat een medewerker moet controleren of beslissen. Beslissingen met juridische, financiële, personele of gezondheidsgevolgen verlopen niet volledig automatisch.",
        },
        {
          question: copy.v2_tekst_043 ?? "Wat gebeurt er na de sprint?",
          answer:
            copy.v2_tekst_044 ??
            "De klant ontvangt instructies en afspraken voor zelfstandig gebruik en beheer. Daarna besluiten we over zelfstandig verdergaan, een afzonderlijke optimalisatie of een groeipartnerschap. Een vervolg is niet verplicht.",
        },
      ]}
    >
      <section
        className="ws-literacy-section"
        aria-labelledby="implementation-examples"
      >
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">{copy.v2_tekst_045 ?? "Toepassingen"}</p>
            <h2 id="implementation-examples">
              {copy.v2_tekst_046 ?? "Minder handwerk, met een controlepunt."}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_047 ??
                "Een workflow kan informatie uit goedgekeurde bronnen verzamelen, een concept voorbereiden en het resultaat aan een medewerker voorleggen. Die medewerker controleert feiten, uitzonderingen en toezeggingen voordat de uitkomst wordt gebruikt."}
            </p>
            <p>
              {copy.v2_tekst_048 ?? "Onze "}
              <Link href={copy.v2_link_049 ?? "/praktijkvoorbeelden"}>
                {copy.v2_tekst_050 ?? "praktijkvoorbeelden"}
              </Link>{" "}
              {copy.v2_tekst_051 ??
                "laten toepassingen zien rond marktinformatie en nieuwsbriefproductie. Dat zijn contextgebonden voorbeelden, geen voorspelling van jullie resultaat."}
            </p>
            <p>
              {copy.v2_tekst_052 ?? "Voor blijvende begeleiding is er de "}
              <Link href={copy.v2_link_053 ?? "/ai-groeipartner"}>
                {copy.v2_tekst_054 ?? "AI-groeipartner"}
              </Link>
              {copy.v2_tekst_055 ??
                ". Vraagt de oplossing nieuwe software of complexe koppelingen? Begin met een "}
              <Link href={copy.v2_link_056 ?? "/ai-maatwerk"}>
                {copy.v2_tekst_057 ?? "afzonderlijke maatwerkverkenning"}
              </Link>
              {copy.v2_tekst_058 ?? "."}
            </p>
          </div>
        </div>
      </section>
    </ServicePage>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("ai-implementatie"),
    readPublished("shared"),
  ]);
  return <CmsAiImplementatie copy={copy} sharedCopy={sharedCopy} />;
}
