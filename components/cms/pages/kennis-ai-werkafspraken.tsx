import Link from "next/link";
import KnowledgeArticle from "@/components/workspoor/KnowledgeArticle";
import { KNOWLEDGE_ARTICLES } from "@/lib/knowledge";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";
const article = KNOWLEDGE_ARTICLES[2];
const baseMetadata = createPageMetadata({
  title: article.title,
  description: article.description,
  path: `/kennis/${article.slug}`,
});
export async function generateMetadata() {
  return cmsMetadata("kennis-ai-werkafspraken", baseMetadata);
}
export async function CmsKennisAiWerkafspraken({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { KNOWLEDGE_ARTICLES } = sharedContent(sharedCopy);
  const article = KNOWLEDGE_ARTICLES[2];

  return (
    <KnowledgeArticle
      sharedCopy={sharedCopy}
      preview={preview}
      slug={article.slug}
      intro={
        copy.v2_tekst_001 ??
        "Bruikbare AI-werkafspraken beschrijven waarvoor medewerkers AI mogen gebruiken, met welke informatie, wie de uitkomst controleert en waar zij terechtkunnen bij twijfel. Maak de afspraken herkenbaar voor een concrete taak en wijs een eigenaar aan."
      }
      sections={[
        {
          id: "onderdelen",
          title: copy.v2_tekst_002 ?? "Zeven onderdelen van werkbare afspraken",
          content: (
            <>
              <ol>
                <li>
                  <strong>{copy.v2_tekst_006 ?? "Taak en doel."}</strong>{" "}
                  {copy.v2_tekst_007 ??
                    "Beschrijf welk werk de toepassing ondersteunt en waarvoor zij niet bedoeld is."}
                </li>
                <li>
                  <strong>
                    {copy.v2_tekst_008 ?? "Hulpmiddel en account."}
                  </strong>{" "}
                  {copy.v2_tekst_009 ??
                    "Leg vast welke toepassing en welk zakelijk account zijn goedgekeurd. Een privéaccount is niet vanzelf een toegestaan alternatief."}
                </li>
                <li>
                  <strong>{copy.v2_tekst_010 ?? "Gegevens."}</strong>{" "}
                  {copy.v2_tekst_011 ??
                    "Benoem welke bronnen en gegevens zijn toegestaan. Laat de verantwoordelijke vooraf privacy, vertrouwelijkheid en instellingen beoordelen."}
                </li>
                <li>
                  <strong>{copy.v2_tekst_012 ?? "Controle."}</strong>{" "}
                  {copy.v2_tekst_013 ??
                    "Schrijf op wat de medewerker altijd controleert, zoals feiten, bron, berekening, naam en toezegging."}
                </li>
                <li>
                  <strong>
                    {copy.v2_tekst_014 ?? "Besluit en verzending."}
                  </strong>{" "}
                  {copy.v2_tekst_015 ??
                    "Maak duidelijk wie het definitieve resultaat goedkeurt en gebruikt."}
                </li>
                <li>
                  <strong>
                    {copy.v2_tekst_016 ?? "Twijfel en incidenten."}
                  </strong>{" "}
                  {copy.v2_tekst_017 ??
                    "Bepaal bij wie een medewerker stopt, meldt of hulp vraagt."}
                </li>
                <li>
                  <strong>{copy.v2_tekst_018 ?? "Onderhoud."}</strong>{" "}
                  {copy.v2_tekst_019 ??
                    "Noteer eigenaar, datum en het moment waarop de afspraken opnieuw worden bekeken."}
                </li>
              </ol>
            </>
          ),
        },
        {
          id: "voorbeeld",
          title: copy.v2_tekst_003 ?? "Voorbeeld: een klantmail voorbereiden",
          content: (
            <>
              <p>
                {copy.v2_tekst_020 ??
                  "Onderstaand voorbeeld is een startpunt voor bespreking, geen vastgesteld beleid voor jouw organisatie."}
              </p>
              <dl>
                <dt>{copy.v2_tekst_021 ?? "Doel"}</dt>
                <dd>
                  {copy.v2_tekst_022 ??
                    "Een conceptantwoord maken op een algemene productvraag."}
                </dd>
                <dt>{copy.v2_tekst_023 ?? "Toegestane invoer"}</dt>
                <dd>
                  {copy.v2_tekst_024 ??
                    "Alleen goedgekeurde productinformatie en een geanonimiseerde beschrijving van de vraag. Geen klantdossier invoeren."}
                </dd>
                <dt>{copy.v2_tekst_025 ?? "Hulpmiddel"}</dt>
                <dd>
                  {copy.v2_tekst_026 ??
                    "De door de organisatie aangewezen toepassing en het goedgekeurde account."}
                </dd>
                <dt>{copy.v2_tekst_027 ?? "Controle"}</dt>
                <dd>
                  {copy.v2_tekst_028 ??
                    "De medewerker vergelijkt productgegevens, prijzen en toezeggingen met de oorspronkelijke bron. Ontbrekende informatie wordt nagevraagd."}
                </dd>
                <dt>{copy.v2_tekst_029 ?? "Verzending"}</dt>
                <dd>
                  {copy.v2_tekst_030 ??
                    "De medewerker past het concept aan en verstuurt het pas na controle."}
                </dd>
                <dt>{copy.v2_tekst_031 ?? "Bij twijfel"}</dt>
                <dd>
                  {copy.v2_tekst_032 ??
                    "Geen toezegging doen. Vraag de proceseigenaar om beoordeling."}
                </dd>
                <dt>{copy.v2_tekst_033 ?? "Opvolging"}</dt>
                <dd>
                  {copy.v2_tekst_034 ??
                    "De teamleider verzamelt knelpunten en bespreekt na dertig dagen of de afspraak werkbaar is."}
                </dd>
              </dl>
            </>
          ),
        },
        {
          id: "invoeren",
          title: copy.v2_tekst_004 ?? "Hoe laat je de afspraken landen?",
          content: (
            <>
              <p>
                {copy.v2_tekst_035 ??
                  "Laat medewerkers de afspraak op een paar herkenbare situaties toepassen. Voeg ook een foutieve uitkomst toe: herkennen zij het probleem en weten zij wat ze daarna moeten doen? Pas onduidelijke formuleringen aan voordat je het document vaststelt."}
              </p>
              <p>
                {copy.v2_tekst_036 ??
                  "Zet de actuele versie op een vindbare plek. Neem de uitleg mee bij de start van nieuwe medewerkers en bij veranderingen in hulpmiddelen of werkzaamheden. Een document zonder eigenaar of gebruiksgesprek veroudert snel."}
              </p>
              <p>
                {copy.v2_tekst_037 ?? "In de "}
                <Link href={copy.v2_link_038 ?? "/ai-geletterdheid"}>
                  {copy.v2_tekst_039 ?? "teamtraining AI-geletterdheid"}
                </Link>{" "}
                {copy.v2_tekst_040 ??
                  "oefenen we met twee werksituaties en maken we een concept voor teamafspraken. De organisatie stelt de afspraken vast; na ongeveer dertig dagen bespreken we het gebruik."}
              </p>
            </>
          ),
        },
        {
          id: "grens",
          title: copy.v2_tekst_005 ?? "Is dit ook een volledig AI-beleid?",
          content: (
            <>
              <p>
                {copy.v2_tekst_041 ??
                  "Nee. Deze gids helpt bij dagelijkse afspraken. Een organisatie kan daarnaast keuzes moeten vastleggen over inkoop, toegang, beveiliging, privacy, toezicht en bijzondere toepassingen. Laat die onderwerpen beoordelen door de verantwoordelijke inhoudelijke deskundigen."}
              </p>
              <p>
                {copy.v2_tekst_042 ??
                  "Een ingevuld document of deelname aan een training is geen algemene nalevingsgarantie. Lees onze "}
                <Link
                  href={
                    copy.v2_link_043 ?? "/kennis/ai-geletterdheid-verplicht"
                  }
                >
                  {copy.v2_tekst_044 ??
                    "uitleg over AI-geletterdheid en de verplichting"}
                </Link>{" "}
                {copy.v2_tekst_045 ?? "voor de actuele bronnen en grenzen."}
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
    readPublished("kennis-ai-werkafspraken"),
    readPublished("shared"),
  ]);
  return <CmsKennisAiWerkafspraken copy={copy} sharedCopy={sharedCopy} />;
}
