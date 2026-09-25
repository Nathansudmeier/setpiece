import Link from "next/link";
import ServicePage from "@/components/workspoor/ServicePage";
import { createPageMetadata } from "@/lib/seo";

const description = "Onderzoek eerst wat AI-maatwerk vraagt van gebruikers, gegevens, beveiliging en beheer. Een afzonderlijke verkenning vanaf € 3.500 exclusief btw, vóór de bouwbegroting.";

export const metadata = createPageMetadata({
  title: "AI-maatwerk: eerst scope, haalbaarheid en kosten",
  description,
  path: "/ai-maatwerk",
});

export default function AiMaatwerkPage() {
  return (
    <ServicePage
      path="/ai-maatwerk"
      name="AI-maatwerkverkenning"
      title="AI-maatwerk begint met een onderbouwd besluit."
      description={description}
      price="Vanaf € 3.500"
      priceNote="exclusief btw, voor de verkenning"
      term="Scope, planning en prijs vooraf op maat. De bouw is een afzonderlijke opdracht."
      action="Bespreek de maatwerkverkenning"
      definition={<><p>Een AI-maatwerkverkenning onderzoekt wat nodig is voordat nieuwe software, een uitgebreid portaal of een complexe koppeling wordt begroot. Het bedrijfsdoel, de gebruikers en het toekomstige beheer staan voorop.</p><p>Deze route past wanneer de vraag buiten bestaande workflows en de standaard implementatiesprint valt. We beoordelen eerst of maatwerk nodig en verantwoord is. Een bestaande oplossing, kleinere scope of niet bouwen kan ook de uitkomst zijn.</p><p>Voor het verbeteren van bestaande processen zijn de <Link href="/kansenscan">kansenscan</Link> en <Link href="/ai-implementatie">implementatiesprint</Link> de gebruikelijke route.</p></>}
      included={[
        "Afbakening van de taak, gebruikers en gewenste bedrijfsuitkomst.",
        "Verkenning van benodigde gegevens, systemen en koppelingen.",
        "Uitwerking van rollen, beveiliging, beheer en overdracht.",
        "Beoordeling van haalbaarheid en relevante alternatieven.",
        "Inzicht in de kostenonderdelen en voorwaarden voor een bouwbegroting.",
        "Een besluitbasis voor stoppen, kleiner beginnen of afzonderlijk bouwen.",
      ]}
      required={[
        "Een beslisser en inhoudelijk eigenaar van het bedrijfsprobleem.",
        "Beschikbare gebruikers om de huidige werkwijze toe te lichten.",
        "Inzicht in systemen, gegevens, toegang en beperkingen.",
        "Een verantwoordelijke voor toekomstig beheer.",
        "Budget en capaciteit om een onderbouwd vervolgbesluit te nemen.",
      ]}
      steps={[
        ["Het doel afbakenen", "We beschrijven welke taak eenvoudiger of beter moet, voor wie en onder welke voorwaarden."],
        ["De voorwaarden onderzoeken", "We bekijken gegevens, rollen, bestaande systemen, beveiliging en toekomstig beheer."],
        ["Alternatieven vergelijken", "We beoordelen wat bestaande oplossingen kunnen en waar daadwerkelijk maatwerk nodig zou zijn."],
        ["Een vervolgbesluit nemen", "We maken scope, risico’s en kostenonderdelen bespreekbaar voordat een afzonderlijke bouwopdracht wordt begroot."],
      ]}
      exclusions={[
        "De bouw en productieoplevering van de software zelf.",
        "Een onbeperkte technische of juridische audit.",
        "Een vaste bouwprijs voordat de scope en afhankelijkheden bekend zijn.",
        "Onbeperkt onderzoek naar nieuwe wensen buiten de afgesproken vraag.",
      ]}
      faq={[
        { question: "Is € 3.500 de prijs van de software?", answer: "Nee. De verkenning begint vanaf € 3.500 exclusief btw. De bouw, eventuele licenties, gegevenskoppelingen en het beheer worden op basis van de uitkomst afzonderlijk begroot. De precieze prijs en planning van de verkenning spreken we vooraf af." },
        { question: "Wanneer is een implementatiesprint voldoende?", answer: "Een sprint past bij één bedrijfsprobleem en maximaal twee samenhangende workflows binnen bestaande systemen en beschikbare koppelingen. Nieuwe maatwerksoftware, uitgebreide portals of complexe gegevensmigraties vallen buiten die standaardopdracht." },
        { question: "Ben ik na de verkenning verplicht om te laten bouwen?", answer: "Nee. De verkenning helpt een vervolgbesluit nemen. De uitkomst kan ook zijn om te stoppen, een bestaande oplossing te gebruiken of de vraag kleiner te maken. Bouwen vraagt een afzonderlijke opdracht." },
        { question: "Wie is verantwoordelijk voor de uitvoering?", answer: "Nathan blijft verantwoordelijk voor diagnose, klantrelatie, implementatieregie en kwaliteit. Als specialistische kennis nodig is, bespreken we de rol en betrokkenheid daarvan binnen de afbakening. Eigenaarschap bij de klant blijft nodig." },
      ]}
    >
      <section className="ws-literacy-section" aria-labelledby="custom-decision">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Kosten en beheer</p><h2 id="custom-decision">De bouwprijs is maar een deel van de afweging.</h2></div>
          <div><p>Een oplossing vraagt ook onderhoud, toegang tot gegevens, controle op fouten en iemand die wijzigingen kan beoordelen. Daarom hoort toekomstig beheer al bij de verkenning.</p><p>Setpiece neemt maatwerk aan wanneer het bedrijfsprobleem, de uitvoerbaarheid en beschikbare capaciteit goed aansluiten. Een verkenning geeft geen automatische toezegging voor een bouwtraject.</p><p>Lees meer over <Link href="/werkwijze">onze werkwijze en verantwoordelijkheden</Link> of over <Link href="/over">Nathan en Setpiece</Link>.</p></div>
        </div>
      </section>
    </ServicePage>
  );
}
