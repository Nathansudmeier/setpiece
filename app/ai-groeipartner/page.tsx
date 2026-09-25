import Link from "next/link";
import ServicePage from "@/components/workspoor/ServicePage";
import { createPageMetadata } from "@/lib/seo";

const description = "Borg het gebruik van AI-workflows, begeleid medewerkers en verbeter bestaande processen. Doorlopende AI-begeleiding voor het mkb, vanaf € 2.250 per maand exclusief btw.";

export const metadata = createPageMetadata({
  title: "AI-groeipartner: begeleiding, adoptie en verbetering",
  description,
  path: "/ai-groeipartner",
});

export default function AiGroeipartnerPage() {
  return (
    <ServicePage
      path="/ai-groeipartner"
      name="AI-groeipartner"
      title="AI-begeleiding die dagelijks gebruik versterkt."
      description={description}
      price="Vanaf € 2.250"
      priceNote="per maand, exclusief btw"
      term="Minimaal zes maanden. Capaciteit, beschikbaarheid en reactietijd spreken we vooraf af."
      action="Bespreek het groeipartnerschap"
      definition={<><p>De AI-groeipartner is doorlopende begeleiding bij het gebruiken en verbeteren van bestaande AI-workflows. We kijken of medewerkers de werkwijze toepassen, of de uitkomst bruikbaar blijft en welke verbetering nu voorrang heeft.</p><p>Dit past bij een B2B-dienstverlener die al een werkende toepassing en een interne eigenaar heeft. Je wilt blijven verbeteren zonder voor iedere kleine aanpassing opnieuw een traject op te tuigen.</p><p>Moet de eerste workflow nog worden gebouwd? Bekijk de <Link href="/ai-implementatie">AI-implementatiesprint</Link>. Voor een team dat vooral basiskennis en afspraken nodig heeft, is er <Link href="/ai-geletterdheid">training AI-geletterdheid</Link>.</p></>}
      included={[
        "Maandelijkse bespreking met directie of proceseigenaar.",
        "Actueel overzicht van doelen, gebruik, knelpunten en effect.",
        "Optimalisaties binnen bestaande workflows en afgesproken capaciteit.",
        "Begeleiding van medewerkers en interne eigenaars.",
        "Bijgewerkte instructies en vastgelegde vervolgacties.",
        "Kwartaaladvies over koers, risico en rendement.",
      ]}
      required={[
        "Een interne eigenaar die prioriteiten vaststelt en besluiten neemt.",
        "Medewerkers die tijd hebben voor feedback en praktijktests.",
        "Inzicht in gebruik, herstelwerk en relevante resultaten.",
        "Geregelde toegang en afspraken over gegevensgebruik.",
        "Een maandelijkse keuze binnen de afgesproken capaciteit.",
      ]}
      steps={[
        ["Meten", "We bekijken gebruik, effect, uitzonderingen en feedback van medewerkers."],
        ["Prioriteren", "We kiezen maximaal één hoofdverbetering voor de maand, met eigenaar en meetpunt."],
        ["Verbeteren", "De afgesproken verbetering wordt uitgevoerd en met de betrokken medewerker getest."],
        ["Borgen", "We werken instructies bij, leggen open risico’s vast en bereiden de volgende prioriteit voor."],
      ]}
      exclusions={[
        "Een nieuwe grote implementatie: daarvoor spreken we een afzonderlijke sprint af.",
        "Maatwerksoftware en complexe koppelingen.",
        "Doorlopende operationele uitvoering namens de klant.",
        "Onbeperkte beschikbaarheid of een onbeperkt urenabonnement.",
        "Juridisch, fiscaal of beveiligingsadvies buiten de eigen deskundigheid.",
      ]}
      faq={[
        { question: "Hoe lang duurt het partnerschap?", answer: "De minimale looptijd is zes maanden. Iedere drie maanden bespreken we resultaten, gebruik, risico’s en gewenste capaciteit. Omvang, beschikbaarheid en reactietijd staan in de overeenkomst." },
        { question: "Wat is inbegrepen in het maandbedrag?", answer: "Vanaf € 2.250 exclusief btw per maand krijg je begeleiding, resultaatbespreking en verbeteringen binnen vooraf afgesproken capaciteit. De precieze omvang leggen we per klant vast. Groter nieuw werk wordt afzonderlijk geprijsd. Betaling vindt vooraf per maand plaats." },
        { question: "Hoe voorkomen we afhankelijkheid van Setpiece?", answer: "De interne eigenaar blijft beslissen. Medewerkers testen mee en ontvangen bijgewerkte instructies. We beoordelen niet alleen of de techniek werkt, maar ook of de klant de werkwijze zelfstandig begrijpt en gebruikt." },
        { question: "Wat als een workflow weinig wordt gebruikt?", answer: "Dan onderzoeken we samen de oorzaak: past de toepassing nog bij het werk, is de kwaliteit voldoende en weten mensen hoe ze ermee omgaan? Op basis daarvan besluiten we over verbeteren, opnieuw begeleiden of stoppen." },
      ]}
    >
      <section className="ws-literacy-section" aria-labelledby="partner-result">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Gebruik en resultaat</p><h2 id="partner-result">Een werkende toepassing moet ook gebruikt worden.</h2></div>
          <div><p>Een rapportage kan technisch goed draaien terwijl medewerkers de uitkomst alsnog handmatig controleren of opnieuw maken. Daarom bespreken we ook herstelwerk, uitzonderingen en de ervaring van de mensen die ermee werken.</p><p>We zetten tijdwinst, kwaliteit en commerciële voortgang af tegen de gekozen nulmeting en de kosten van het gebruik. Nieuwe wensen krijgen een afweging voordat ze worden gebouwd.</p><p>Lees hoe <Link href="/werkwijze">Setpiece met meten en overdracht werkt</Link> en bekijk de <Link href="/praktijkvoorbeelden">toepassingen uit de praktijk</Link>.</p></div>
        </div>
      </section>
    </ServicePage>
  );
}
