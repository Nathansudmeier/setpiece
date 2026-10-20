import Link from "next/link";
import ServicePage from "@/components/workspoor/ServicePage";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";

const description =
  "Onderzoek eerst wat AI-maatwerk vraagt van gebruikers, gegevens, beveiliging en beheer. Een afzonderlijke verkenning vanaf € 3.500 exclusief btw, vóór de bouwbegroting.";
const baseMetadata = createPageMetadata({
  title: "AI-maatwerk: eerst scope, haalbaarheid en kosten",
  description,
  path: "/ai-maatwerk",
});
export async function generateMetadata() {
  return cmsMetadata("ai-maatwerk", baseMetadata);
}
export async function CmsAiMaatwerk({
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
    "Onderzoek eerst wat AI-maatwerk vraagt van gebruikers, gegevens, beveiliging en beheer. Een afzonderlijke verkenning vanaf € 3.500 exclusief btw, vóór de bouwbegroting.";

  return (
    <ServicePage
      sharedCopy={sharedCopy}
      preview={preview}
      path="/ai-maatwerk"
      name={copy.v2_tekst_002 ?? "AI-maatwerkverkenning"}
      title={
        copy.v2_tekst_003 ?? "AI-maatwerk begint met een onderbouwd besluit."
      }
      description={description}
      price={copy.v2_tekst_004 ?? "Vanaf € 3.500"}
      priceNote={copy.v2_tekst_005 ?? "exclusief btw, voor de verkenning"}
      term={
        copy.v2_tekst_006 ??
        "Scope, planning en prijs vooraf op maat. De bouw is een afzonderlijke opdracht."
      }
      action={copy.v2_tekst_007 ?? "Bespreek de maatwerkverkenning"}
      definition={
        <>
          <p>
            {copy.v2_tekst_008 ??
              "Een AI-maatwerkverkenning onderzoekt wat nodig is voordat nieuwe software, een uitgebreid portaal of een complexe koppeling wordt begroot. Het bedrijfsdoel, de gebruikers en het toekomstige beheer staan voorop."}
          </p>
          <p>
            {copy.v2_tekst_009 ??
              "Deze route past wanneer de vraag buiten bestaande workflows en de standaard implementatiesprint valt. We beoordelen eerst of maatwerk nodig en verantwoord is. Een bestaande oplossing, kleinere scope of niet bouwen kan ook de uitkomst zijn."}
          </p>
          <p>
            {copy.v2_tekst_010 ??
              "Voor het verbeteren van bestaande processen zijn de "}
            <Link href={copy.v2_link_011 ?? "/kansenscan"}>
              {copy.v2_tekst_012 ?? "kansenscan"}
            </Link>{" "}
            {copy.v2_tekst_013 ?? "en "}
            <Link href={copy.v2_link_014 ?? "/ai-implementatie"}>
              {copy.v2_tekst_015 ?? "implementatiesprint"}
            </Link>{" "}
            {copy.v2_tekst_016 ?? "de gebruikelijke route."}
          </p>
        </>
      }
      included={[
        copy.v2_tekst_017 ??
          "Afbakening van de taak, gebruikers en gewenste bedrijfsuitkomst.",
        copy.v2_tekst_018 ??
          "Verkenning van benodigde gegevens, systemen en koppelingen.",
        copy.v2_tekst_019 ??
          "Uitwerking van rollen, beveiliging, beheer en overdracht.",
        copy.v2_tekst_020 ??
          "Beoordeling van haalbaarheid en relevante alternatieven.",
        copy.v2_tekst_021 ??
          "Inzicht in de kostenonderdelen en voorwaarden voor een bouwbegroting.",
        copy.v2_tekst_022 ??
          "Een besluitbasis voor stoppen, kleiner beginnen of afzonderlijk bouwen.",
      ]}
      required={[
        copy.v2_tekst_023 ??
          "Een beslisser en inhoudelijk eigenaar van het bedrijfsprobleem.",
        copy.v2_tekst_024 ??
          "Beschikbare gebruikers om de huidige werkwijze toe te lichten.",
        copy.v2_tekst_025 ??
          "Inzicht in systemen, gegevens, toegang en beperkingen.",
        copy.v2_tekst_026 ?? "Een verantwoordelijke voor toekomstig beheer.",
        copy.v2_tekst_027 ??
          "Budget en capaciteit om een onderbouwd vervolgbesluit te nemen.",
      ]}
      steps={[
        [
          copy.v2_tekst_028 ?? "Het doel afbakenen",
          copy.v2_tekst_029 ??
            "We beschrijven welke taak eenvoudiger of beter moet, voor wie en onder welke voorwaarden.",
        ],
        [
          copy.v2_tekst_030 ?? "De voorwaarden onderzoeken",
          copy.v2_tekst_031 ??
            "We bekijken gegevens, rollen, bestaande systemen, beveiliging en toekomstig beheer.",
        ],
        [
          copy.v2_tekst_032 ?? "Alternatieven vergelijken",
          copy.v2_tekst_033 ??
            "We beoordelen wat bestaande oplossingen kunnen en waar daadwerkelijk maatwerk nodig zou zijn.",
        ],
        [
          copy.v2_tekst_034 ?? "Een vervolgbesluit nemen",
          copy.v2_tekst_035 ??
            "We maken scope, risico’s en kostenonderdelen bespreekbaar voordat een afzonderlijke bouwopdracht wordt begroot.",
        ],
      ]}
      exclusions={[
        copy.v2_tekst_036 ??
          "De bouw en productieoplevering van de software zelf.",
        copy.v2_tekst_037 ?? "Een onbeperkte technische of juridische audit.",
        copy.v2_tekst_038 ??
          "Een vaste bouwprijs voordat de scope en afhankelijkheden bekend zijn.",
        copy.v2_tekst_039 ??
          "Onbeperkt onderzoek naar nieuwe wensen buiten de afgesproken vraag.",
      ]}
      faq={[
        {
          question: copy.v2_tekst_040 ?? "Is € 3.500 de prijs van de software?",
          answer:
            copy.v2_tekst_041 ??
            "Nee. De verkenning begint vanaf € 3.500 exclusief btw. De bouw, eventuele licenties, gegevenskoppelingen en het beheer worden op basis van de uitkomst afzonderlijk begroot. De precieze prijs en planning van de verkenning spreken we vooraf af.",
        },
        {
          question:
            copy.v2_tekst_042 ??
            "Wanneer is een implementatiesprint voldoende?",
          answer:
            copy.v2_tekst_043 ??
            "Een sprint past bij één bedrijfsprobleem en maximaal twee samenhangende workflows binnen bestaande systemen en beschikbare koppelingen. Nieuwe maatwerksoftware, uitgebreide portals of complexe gegevensmigraties vallen buiten die standaardopdracht.",
        },
        {
          question:
            copy.v2_tekst_044 ??
            "Ben ik na de verkenning verplicht om te laten bouwen?",
          answer:
            copy.v2_tekst_045 ??
            "Nee. De verkenning helpt een vervolgbesluit nemen. De uitkomst kan ook zijn om te stoppen, een bestaande oplossing te gebruiken of de vraag kleiner te maken. Bouwen vraagt een afzonderlijke opdracht.",
        },
        {
          question:
            copy.v2_tekst_046 ?? "Wie is verantwoordelijk voor de uitvoering?",
          answer:
            copy.v2_tekst_047 ??
            "Nathan blijft verantwoordelijk voor diagnose, klantrelatie, implementatieregie en kwaliteit. Als specialistische kennis nodig is, bespreken we de rol en betrokkenheid daarvan binnen de afbakening. Eigenaarschap bij de klant blijft nodig.",
        },
      ]}
    >
      <section
        className="ws-literacy-section"
        aria-labelledby="custom-decision"
      >
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_048 ?? "Kosten en beheer"}
            </p>
            <h2 id="custom-decision">
              {copy.v2_tekst_049 ??
                "De bouwprijs is maar een deel van de afweging."}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_050 ??
                "Een oplossing vraagt ook onderhoud, toegang tot gegevens, controle op fouten en iemand die wijzigingen kan beoordelen. Daarom hoort toekomstig beheer al bij de verkenning."}
            </p>
            <p>
              {copy.v2_tekst_051 ??
                "Setpiece neemt maatwerk aan wanneer het bedrijfsprobleem, de uitvoerbaarheid en beschikbare capaciteit goed aansluiten. Een verkenning geeft geen automatische toezegging voor een bouwtraject."}
            </p>
            <p>
              {copy.v2_tekst_052 ?? "Lees meer over "}
              <Link href={copy.v2_link_053 ?? "/werkwijze"}>
                {copy.v2_tekst_054 ?? "onze werkwijze en verantwoordelijkheden"}
              </Link>{" "}
              {copy.v2_tekst_055 ?? "of over "}
              <Link href={copy.v2_link_056 ?? "/over"}>
                {copy.v2_tekst_057 ?? "Nathan en Setpiece"}
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
    readPublished("ai-maatwerk"),
    readPublished("shared"),
  ]);
  return <CmsAiMaatwerk copy={copy} sharedCopy={sharedCopy} />;
}
