import Link from "next/link";
import ServicePage from "@/components/workspoor/ServicePage";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";

const description =
  "Borg het gebruik van AI-workflows, begeleid medewerkers en verbeter bestaande processen. Doorlopende AI-begeleiding voor het mkb, vanaf € 2.250 per maand exclusief btw.";
const baseMetadata = createPageMetadata({
  title: "AI-groeipartner: begeleiding, adoptie en verbetering",
  description,
  path: "/ai-groeipartner",
});
export async function generateMetadata() {
  return cmsMetadata("ai-groeipartner", baseMetadata);
}
export async function CmsAiGroeipartner({
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
    "Borg het gebruik van AI-workflows, begeleid medewerkers en verbeter bestaande processen. Doorlopende AI-begeleiding voor het mkb, vanaf € 2.250 per maand exclusief btw.";

  return (
    <ServicePage
      sharedCopy={sharedCopy}
      preview={preview}
      path="/ai-groeipartner"
      name={copy.v2_tekst_002 ?? "AI-groeipartner"}
      title={
        copy.v2_tekst_003 ?? "AI-begeleiding die dagelijks gebruik versterkt."
      }
      description={description}
      price={copy.v2_tekst_004 ?? "Vanaf € 2.250"}
      priceNote={copy.v2_tekst_005 ?? "per maand, exclusief btw"}
      term={
        copy.v2_tekst_006 ??
        "Minimaal zes maanden. Capaciteit, beschikbaarheid en reactietijd spreken we vooraf af."
      }
      action={copy.v2_tekst_007 ?? "Bespreek het groeipartnerschap"}
      definition={
        <>
          <p>
            {copy.v2_tekst_008 ??
              "De AI-groeipartner is doorlopende begeleiding bij het gebruiken en verbeteren van bestaande AI-workflows. We kijken of medewerkers de werkwijze toepassen, of de uitkomst bruikbaar blijft en welke verbetering nu voorrang heeft."}
          </p>
          <p>
            {copy.v2_tekst_009 ??
              "Dit past bij een B2B-dienstverlener die al een werkende toepassing en een interne eigenaar heeft. Je wilt blijven verbeteren zonder voor iedere kleine aanpassing opnieuw een traject op te tuigen."}
          </p>
          <p>
            {copy.v2_tekst_010 ??
              "Moet de eerste workflow nog worden gebouwd? Bekijk de "}
            <Link href={copy.v2_link_011 ?? "/ai-implementatie"}>
              {copy.v2_tekst_012 ?? "AI-implementatiesprint"}
            </Link>
            {copy.v2_tekst_013 ??
              ". Voor een team dat vooral basiskennis en afspraken nodig heeft, is er "}
            <Link href={copy.v2_link_014 ?? "/ai-geletterdheid"}>
              {copy.v2_tekst_015 ?? "training AI-geletterdheid"}
            </Link>
            {copy.v2_tekst_016 ?? "."}
          </p>
        </>
      }
      included={[
        copy.v2_tekst_017 ??
          "Maandelijkse bespreking met directie of proceseigenaar.",
        copy.v2_tekst_018 ??
          "Actueel overzicht van doelen, gebruik, knelpunten en effect.",
        copy.v2_tekst_019 ??
          "Optimalisaties binnen bestaande workflows en afgesproken capaciteit.",
        copy.v2_tekst_020 ??
          "Begeleiding van medewerkers en interne eigenaars.",
        copy.v2_tekst_021 ??
          "Bijgewerkte instructies en vastgelegde vervolgacties.",
        copy.v2_tekst_022 ?? "Kwartaaladvies over koers, risico en rendement.",
      ]}
      required={[
        copy.v2_tekst_023 ??
          "Een interne eigenaar die prioriteiten vaststelt en besluiten neemt.",
        copy.v2_tekst_024 ??
          "Medewerkers die tijd hebben voor feedback en praktijktests.",
        copy.v2_tekst_025 ??
          "Inzicht in gebruik, herstelwerk en relevante resultaten.",
        copy.v2_tekst_026 ??
          "Geregelde toegang en afspraken over gegevensgebruik.",
        copy.v2_tekst_027 ??
          "Een maandelijkse keuze binnen de afgesproken capaciteit.",
      ]}
      steps={[
        [
          copy.v2_tekst_028 ?? "Meten",
          copy.v2_tekst_029 ??
            "We bekijken gebruik, effect, uitzonderingen en feedback van medewerkers.",
        ],
        [
          copy.v2_tekst_030 ?? "Prioriteren",
          copy.v2_tekst_031 ??
            "We kiezen maximaal één hoofdverbetering voor de maand, met eigenaar en meetpunt.",
        ],
        [
          copy.v2_tekst_032 ?? "Verbeteren",
          copy.v2_tekst_033 ??
            "De afgesproken verbetering wordt uitgevoerd en met de betrokken medewerker getest.",
        ],
        [
          copy.v2_tekst_034 ?? "Borgen",
          copy.v2_tekst_035 ??
            "We werken instructies bij, leggen open risico’s vast en bereiden de volgende prioriteit voor.",
        ],
      ]}
      exclusions={[
        copy.v2_tekst_036 ??
          "Een nieuwe grote implementatie: daarvoor spreken we een afzonderlijke sprint af.",
        copy.v2_tekst_037 ?? "Maatwerksoftware en complexe koppelingen.",
        copy.v2_tekst_038 ??
          "Doorlopende operationele uitvoering namens de klant.",
        copy.v2_tekst_039 ??
          "Onbeperkte beschikbaarheid of een onbeperkt urenabonnement.",
        copy.v2_tekst_040 ??
          "Juridisch, fiscaal of beveiligingsadvies buiten de eigen deskundigheid.",
      ]}
      faq={[
        {
          question: copy.v2_tekst_041 ?? "Hoe lang duurt het partnerschap?",
          answer:
            copy.v2_tekst_042 ??
            "De minimale looptijd is zes maanden. Iedere drie maanden bespreken we resultaten, gebruik, risico’s en gewenste capaciteit. Omvang, beschikbaarheid en reactietijd staan in de overeenkomst.",
        },
        {
          question:
            copy.v2_tekst_043 ?? "Wat is inbegrepen in het maandbedrag?",
          answer:
            copy.v2_tekst_044 ??
            "Vanaf € 2.250 exclusief btw per maand krijg je begeleiding, resultaatbespreking en verbeteringen binnen vooraf afgesproken capaciteit. De precieze omvang leggen we per klant vast. Groter nieuw werk wordt afzonderlijk geprijsd. Betaling vindt vooraf per maand plaats.",
        },
        {
          question:
            copy.v2_tekst_045 ??
            "Hoe voorkomen we afhankelijkheid van Setpiece?",
          answer:
            copy.v2_tekst_046 ??
            "De interne eigenaar blijft beslissen. Medewerkers testen mee en ontvangen bijgewerkte instructies. We beoordelen niet alleen of de techniek werkt, maar ook of de klant de werkwijze zelfstandig begrijpt en gebruikt.",
        },
        {
          question:
            copy.v2_tekst_047 ?? "Wat als een workflow weinig wordt gebruikt?",
          answer:
            copy.v2_tekst_048 ??
            "Dan onderzoeken we samen de oorzaak: past de toepassing nog bij het werk, is de kwaliteit voldoende en weten mensen hoe ze ermee omgaan? Op basis daarvan besluiten we over verbeteren, opnieuw begeleiden of stoppen.",
        },
      ]}
    >
      <section className="ws-literacy-section" aria-labelledby="partner-result">
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_049 ?? "Gebruik en resultaat"}
            </p>
            <h2 id="partner-result">
              {copy.v2_tekst_050 ??
                "Een werkende toepassing moet ook gebruikt worden."}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_051 ??
                "Een rapportage kan technisch goed draaien terwijl medewerkers de uitkomst alsnog handmatig controleren of opnieuw maken. Daarom bespreken we ook herstelwerk, uitzonderingen en de ervaring van de mensen die ermee werken."}
            </p>
            <p>
              {copy.v2_tekst_052 ??
                "We zetten tijdwinst, kwaliteit en commerciële voortgang af tegen de gekozen nulmeting en de kosten van het gebruik. Nieuwe wensen krijgen een afweging voordat ze worden gebouwd."}
            </p>
            <p>
              {copy.v2_tekst_053 ?? "Lees hoe "}
              <Link href={copy.v2_link_054 ?? "/werkwijze"}>
                {copy.v2_tekst_055 ?? "Setpiece met meten en overdracht werkt"}
              </Link>{" "}
              {copy.v2_tekst_056 ?? "en bekijk de "}
              <Link href={copy.v2_link_057 ?? "/praktijkvoorbeelden"}>
                {copy.v2_tekst_058 ?? "toepassingen uit de praktijk"}
              </Link>
              {copy.v2_tekst_059 ?? "."}
            </p>
          </div>
        </div>
      </section>
    </ServicePage>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("ai-groeipartner"),
    readPublished("shared"),
  ]);
  return <CmsAiGroeipartner copy={copy} sharedCopy={sharedCopy} />;
}
