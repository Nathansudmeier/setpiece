import Link from "next/link";
import ServicePage from "@/components/workspoor/ServicePage";
import { createPageMetadata } from "@/lib/seo";

const description = "Maak in vier weken maximaal twee samenhangende AI-workflows werkend, getest en overdraagbaar. Voor één bedrijfsprobleem, met medewerkers en menselijke controle.";

export const metadata = createPageMetadata({
  title: "AI-implementatie voor het mkb: workflows die werken",
  description,
  path: "/ai-implementatie",
});

export default function AiImplementatiePage() {
  return (
    <ServicePage
      path="/ai-implementatie"
      name="AI-implementatiesprint"
      title="AI-implementatie die onderdeel wordt van het werk."
      description={description}
      price="€ 7.500"
      priceNote="exclusief btw"
      term="Vier weken. Eén bedrijfsprobleem. Maximaal twee samenhangende workflows."
      action="Bespreek de implementatiesprint"
      definition={<><p>AI-implementatie is het inrichten, testen en invoeren van een toepassing in een bestaand werkproces. Bij Setpiece hoort daar ook bij dat medewerkers ermee kunnen werken en dat de klant weet wie controleert en beheert.</p><p>De sprint past wanneer de prioriteit helder is. Bijvoorbeeld bij terugkerende rapportage, het voorbereiden van klantcommunicatie of het verzamelen van marktinformatie. Welke toepassing geschikt is, hangt af van jullie proces, gegevens en systemen.</p><p>Is nog niet duidelijk waar je verantwoord begint? De <Link href="/kansenscan">AI-kansenscan</Link> vergelijkt eerst maximaal drie processen en onderbouwt de keuze.</p></>}
      included={[
        "Procesontwerp, afbakening en nulmeting.",
        "Inrichting binnen bestaande systemen waar dat verantwoord is.",
        "Maximaal twee samenhangende workflows rond één bedrijfsprobleem.",
        "Praktijktest met echte gebruikers, inclusief uitzonderingen en fouten.",
        "Menselijke controles, werkinstructie en beheernotitie.",
        "Overdracht, korte gebruikstraining en eerste effectmeting.",
      ]}
      required={[
        "Eén beslisser en één proceseigenaar.",
        "Minimaal twee gebruikers die tijd krijgen om te testen.",
        "Veilige testgegevens en geregelde toegang tot systemen.",
        "Akkoord op de scope, nulmeting en acceptatiecriteria.",
        "Een interne eigenaar voor gebruik en beheer na overdracht.",
      ]}
      steps={[
        ["Week 1: afbakenen", "We leggen proces, doelen, rollen, controles en acceptatiecriteria vast. De klant geeft akkoord op het ontwerp en testplan."],
        ["Week 2: bouwen", "We richten een testbare versie in met veilige gegevens. Normale situaties, uitzonderingen en foutmeldingen worden gecontroleerd."],
        ["Week 3: testen", "Gebruikers voeren herkenbare taken uit. We beoordelen doorlooptijd, kwaliteit en gebruiksgemak en verwerken noodzakelijke correcties."],
        ["Week 4: overdragen", "We leggen instructies, beheer en terugvalafspraken vast, trainen de betrokkenen en meten het eerste resultaat."],
      ]}
      exclusions={[
        "Nieuwe maatwerksoftware, uitgebreide portals en complexe koppelingen.",
        "Grote gegevensmigraties en juridische beoordeling.",
        "Nieuwe processen of extra workflows buiten de afgesproken scope.",
        "Doorlopende contentproductie en onbeperkte wijzigingen.",
      ]}
      faq={[
        { question: "Moeten we eerst een kansenscan doen?", answer: "De kansenscan is de gebruikelijke eerste stap wanneer de prioriteit nog niet onderbouwd is. Voor een sprint moeten probleem, eigenaar, gegevens en acceptatiecriteria duidelijk zijn. In een kennismaking bespreken we wat al beschikbaar is en welke voorbereiding nodig is." },
        { question: "Wat kost AI-implementatie bij Setpiece?", answer: "De afgebakende implementatiesprint kost € 7.500 exclusief btw. Je betaalt 50 procent bij opdracht en 50 procent bij oplevering. Reiskosten, externe licenties en verbruik worden vooraf benoemd. Start de sprint binnen 30 dagen na de kansenscan, dan wordt € 750 verrekend." },
        { question: "Vervangt de workflow het oordeel van medewerkers?", answer: "We spreken per proces af wat een toepassing mag voorbereiden en wat een medewerker moet controleren of beslissen. Beslissingen met juridische, financiële, personele of gezondheidsgevolgen verlopen niet volledig automatisch." },
        { question: "Wat gebeurt er na de sprint?", answer: "De klant ontvangt instructies en afspraken voor zelfstandig gebruik en beheer. Daarna besluiten we over zelfstandig verdergaan, een afzonderlijke optimalisatie of een groeipartnerschap. Een vervolg is niet verplicht." },
      ]}
    >
      <section className="ws-literacy-section" aria-labelledby="implementation-examples">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Toepassingen</p><h2 id="implementation-examples">Minder handwerk, met een controlepunt.</h2></div>
          <div><p>Een workflow kan informatie uit goedgekeurde bronnen verzamelen, een concept voorbereiden en het resultaat aan een medewerker voorleggen. Die medewerker controleert feiten, uitzonderingen en toezeggingen voordat de uitkomst wordt gebruikt.</p><p>Onze <Link href="/praktijkvoorbeelden">praktijkvoorbeelden</Link> laten toepassingen zien rond marktinformatie en nieuwsbriefproductie. Dat zijn contextgebonden voorbeelden, geen voorspelling van jullie resultaat.</p><p>Voor blijvende begeleiding is er de <Link href="/ai-groeipartner">AI-groeipartner</Link>. Vraagt de oplossing nieuwe software of complexe koppelingen? Begin met een <Link href="/ai-maatwerk">afzonderlijke maatwerkverkenning</Link>.</p></div>
        </div>
      </section>
    </ServicePage>
  );
}
