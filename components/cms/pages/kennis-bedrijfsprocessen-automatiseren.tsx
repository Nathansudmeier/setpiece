import Link from "next/link";
import KnowledgeArticle from "@/components/workspoor/KnowledgeArticle";
import { KNOWLEDGE_ARTICLES } from "@/lib/knowledge";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";
const article = KNOWLEDGE_ARTICLES[0];
const baseMetadata = createPageMetadata({
  title: article.title,
  description: article.description,
  path: `/kennis/${article.slug}`,
});
export async function generateMetadata() {
  return cmsMetadata("kennis-bedrijfsprocessen-automatiseren", baseMetadata);
}
export async function CmsKennisBedrijfsprocessenAutomatiseren({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { KNOWLEDGE_ARTICLES } = sharedContent(sharedCopy);
  const article = KNOWLEDGE_ARTICLES[0];

  return (
    <KnowledgeArticle
      sharedCopy={sharedCopy}
      preview={preview}
      slug={article.slug}
      intro={
        copy.v2_tekst_001 ??
        "Begin met een terugkerend proces waarvan je het gewenste resultaat kunt controleren. AI kan helpen bij ongestructureerde informatie, zoals tekst. Voor vaste regels is gewone automatisering vaak voldoende. De keuze volgt uit het werkprobleem."
      }
      sections={[
        {
          id: "verschil",
          title: copy.v2_tekst_002 ?? "AI of gewone automatisering?",
          content: (
            <>
              <p>
                {copy.v2_tekst_007 ??
                  "Een vaste afspraak hoeft geen AI-oplossing te worden. Denk aan een herinnering versturen als een datum verstrijkt of een formulier controleren op ontbrekende velden. Regels kunnen daar duidelijk en voorspelbaar zijn."}
              </p>
              <p>
                {copy.v2_tekst_008 ??
                  "AI komt eerder in beeld als informatie steeds anders wordt aangeleverd: klantvragen ordenen, notities samenvatten of een eerste concept maken. De uitkomst moet dan worden gecontroleerd. Een bruikbare workflow kan beide combineren: vaste regels voor verzending en toegang, AI voor een concept en een medewerker voor de beoordeling."}
              </p>
            </>
          ),
        },
        {
          id: "voorbeelden",
          title:
            copy.v2_tekst_003 ?? "Welke processen zijn een mogelijke start?",
          content: (
            <>
              <p>
                {copy.v2_tekst_009 ??
                  "Onderstaande situaties zijn voorbeelden om te onderzoeken, geen standaardoplossingen of beloofde resultaten."}
              </p>
              <ul>
                <li>
                  <strong>
                    {copy.v2_tekst_010 ?? "Klantvragen voorbereiden."}
                  </strong>{" "}
                  {copy.v2_tekst_011 ??
                    "Een medewerker ontvangt een concept op basis van goedgekeurde informatie en controleert inhoud en toezeggingen voor verzending."}
                </li>
                <li>
                  <strong>
                    {copy.v2_tekst_012 ?? "Overleggen verwerken."}
                  </strong>{" "}
                  {copy.v2_tekst_013 ??
                    "Afspraken uit toegestane notities worden geordend. De deelnemers bevestigen actie, eigenaar en datum voordat de lijst wordt gebruikt."}
                </li>
                <li>
                  <strong>
                    {copy.v2_tekst_014 ?? "Marktinformatie samenvatten."}
                  </strong>{" "}
                  {copy.v2_tekst_015 ??
                    "Een team krijgt relevante wijzigingen met bronverwijzingen en beoordeelt welke gevolgen die hebben."}
                </li>
                <li>
                  <strong>
                    {copy.v2_tekst_016 ?? "Bestaande inhoud hergebruiken."}
                  </strong>{" "}
                  {copy.v2_tekst_017 ??
                    "Een goedgekeurde webtekst wordt een nieuwsbriefconcept. Een redacteur controleert feiten, toon en actualiteit."}
                </li>
              </ul>
              <p>
                {copy.v2_tekst_018 ?? "Onze "}
                <Link href={copy.v2_link_019 ?? "/praktijkvoorbeelden"}>
                  {copy.v2_tekst_020 ?? "praktijkvoorbeelden"}
                </Link>{" "}
                {copy.v2_tekst_021 ??
                  "laten zien in welke specifieke werksituaties Setpiece heeft geholpen. Die resultaten zijn geen voorspelling voor een ander bedrijf."}
              </p>
            </>
          ),
        },
        {
          id: "selecteren",
          title: copy.v2_tekst_004 ?? "Hoe kies je het eerste proces?",
          content: (
            <>
              <p>
                {copy.v2_tekst_022 ??
                  "Vergelijk een klein aantal processen. Bij de "}
                <Link href={copy.v2_link_023 ?? "/kansenscan"}>
                  {copy.v2_tekst_024 ?? "Setpiece-kansenscan"}
                </Link>{" "}
                {copy.v2_tekst_025 ??
                  "zijn dat er maximaal drie. Bespreek per proces:"}
              </p>
              <ol>
                <li>
                  <strong>
                    {copy.v2_tekst_026 ?? "Frequentie en inspanning."}
                  </strong>{" "}
                  {copy.v2_tekst_027 ??
                    "Hoe vaak komt het voor en hoeveel werk vraagt het, inclusief herstel en controle?"}
                </li>
                <li>
                  <strong>{copy.v2_tekst_028 ?? "Kwaliteit."}</strong>{" "}
                  {copy.v2_tekst_029 ??
                    "Waaraan herken je een juiste uitkomst? Kun je die beoordeling herhalen?"}
                </li>
                <li>
                  <strong>{copy.v2_tekst_030 ?? "Informatie."}</strong>{" "}
                  {copy.v2_tekst_031 ??
                    "Zijn de benodigde bronnen beschikbaar, actueel en toegestaan voor dit gebruik?"}
                </li>
                <li>
                  <strong>{copy.v2_tekst_032 ?? "Gevolgen."}</strong>{" "}
                  {copy.v2_tekst_033 ??
                    "Wat gebeurt er bij een fout, ontbrekende bron of storing?"}
                </li>
                <li>
                  <strong>{copy.v2_tekst_034 ?? "Eigenaarschap."}</strong>{" "}
                  {copy.v2_tekst_035 ??
                    "Wie kan het proces aanpassen en wie helpt medewerkers bij vragen?"}
                </li>
              </ol>
              <p>
                {copy.v2_tekst_036 ??
                  "Een kleine taak met goede bronnen en een betrokken eigenaar kan een betere start zijn dan een groot proces zonder duidelijke beslisregels."}
              </p>
            </>
          ),
        },
        {
          id: "grenzen",
          title: copy.v2_tekst_005 ?? "Wanneer begin je nog niet?",
          content: (
            <>
              <p>
                {copy.v2_tekst_037 ??
                  "Stel uitvoering uit als niemand verantwoordelijk is, de gegevens niet mogen worden gebruikt of een medewerker de uitkomst niet kan beoordelen. Eerst moeten die voorwaarden helder zijn."}
              </p>
              <p>
                {copy.v2_tekst_038 ??
                  "Laat beslissingen met personele, juridische, financiële of gezondheidsgevolgen niet volledig automatisch verlopen. Betrek de juiste inhoudelijke deskundige en onderzoek de toepasselijke voorwaarden. Ook een proces dat maar zelden voorkomt kan te weinig voordeel bieden om invoering en beheer te rechtvaardigen."}
              </p>
            </>
          ),
        },
        {
          id: "invoeren",
          title: copy.v2_tekst_006 ?? "Hoe maak je de verbetering werkend?",
          content: (
            <>
              <p>
                {copy.v2_tekst_039 ??
                  "Beschrijf de beginsituatie en test met representatieve voorbeelden, inclusief uitzonderingen. Leg vast welke gegevens worden gebruikt, wie controleert en wat er gebeurt als de uitkomst onbruikbaar is. Laat de medewerker de nieuwe werkwijze vervolgens in echt werk beproeven."}
              </p>
              <p>
                {copy.v2_tekst_040 ??
                  "Meet verwerkingstijd én controletijd, foutcorrecties en gebruik. Pas na die test besluit je of de werkwijze kan worden uitgebreid. De "}
                <Link href={copy.v2_link_041 ?? "/ai-implementatie"}>
                  {copy.v2_tekst_042 ?? "implementatiesprint"}
                </Link>{" "}
                {copy.v2_tekst_043 ??
                  "van Setpiece richt zich op maximaal twee samenhangende workflows in vier weken, met instructie en overdracht aan een proceseigenaar."}
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("kennis-bedrijfsprocessen-automatiseren"),
    readPublished("shared"),
  ]);
  return (
    <CmsKennisBedrijfsprocessenAutomatiseren
      copy={copy}
      sharedCopy={sharedCopy}
    />
  );
}
