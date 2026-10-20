import Link from "next/link";
import KnowledgeArticle from "@/components/workspoor/KnowledgeArticle";
import { KNOWLEDGE_ARTICLES } from "@/lib/knowledge";
import { createPageMetadata } from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";
const article = KNOWLEDGE_ARTICLES[1];
const baseMetadata = createPageMetadata({
  title: article.title,
  description: article.description,
  path: `/kennis/${article.slug}`,
});
export async function generateMetadata() {
  return cmsMetadata("kennis-ai-resultaat-meten", baseMetadata);
}
export async function CmsKennisAiResultaatMeten({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { KNOWLEDGE_ARTICLES } = sharedContent(sharedCopy);
  const article = KNOWLEDGE_ARTICLES[1];

  return (
    <KnowledgeArticle
      sharedCopy={sharedCopy}
      preview={preview}
      slug={article.slug}
      intro={
        copy.v2_tekst_001 ??
        "De kosten van AI-invoering bestaan uit meer dan software. Neem onderzoek, inrichting, oefentijd, controle en beheer mee. Meet vervolgens of het werk werkelijk sneller of beter wordt en of medewerkers de werkwijze blijven gebruiken."
      }
      sections={[
        {
          id: "prijzen",
          title: copy.v2_tekst_002 ?? "Wat kost de begeleiding van Setpiece?",
          content: (
            <>
              <p>
                {copy.v2_tekst_006 ??
                  "Dit zijn de prijzen van Setpiece, geen marktgemiddelden. Alle bedragen zijn exclusief btw."}
              </p>
              <dl>
                <dt>
                  <Link href={copy.v2_link_007 ?? "/kansenscan"}>
                    {copy.v2_tekst_008 ?? "AI-kansenscan: € 1.250"}
                  </Link>
                </dt>
                <dd>
                  {copy.v2_tekst_009 ??
                    "Maximaal drie processen vergelijken, een prioriteit en 90-dagenroute bepalen en één kleine verbetering werkend maken, binnen vijf werkdagen na de werksessie. Bij start van een sprint binnen dertig dagen wordt € 750 verrekend."}
                </dd>
                <dt>
                  <Link href={copy.v2_link_010 ?? "/ai-implementatie"}>
                    {copy.v2_tekst_011 ?? "Implementatiesprint: € 7.500"}
                  </Link>
                </dt>
                <dd>
                  {copy.v2_tekst_012 ??
                    "Vier weken voor maximaal twee samenhangende workflows, inclusief testen, instructie en overdracht."}
                </dd>
                <dt>
                  <Link href={copy.v2_link_013 ?? "/ai-groeipartner"}>
                    {copy.v2_tekst_014 ??
                      "Groeipartnerschap: vanaf € 2.250 per maand"}
                  </Link>
                </dt>
                <dd>
                  {copy.v2_tekst_015 ??
                    "Minimaal zes maanden, voor gebruikscontrole en verbetering binnen afgesproken capaciteit. Grotere uitbreidingen worden afzonderlijk begroot."}
                </dd>
                <dt>
                  <Link href={copy.v2_link_016 ?? "/ai-geletterdheid"}>
                    {copy.v2_tekst_017 ??
                      "Teamtraining of lezing: prijs op aanvraag"}
                  </Link>
                </dt>
                <dd>
                  {copy.v2_tekst_018 ??
                    "Afhankelijk van de gekozen werkvorm en situatie."}
                </dd>
                <dt>
                  <Link href={copy.v2_link_019 ?? "/ai-maatwerk"}>
                    {copy.v2_tekst_020 ?? "Maatwerkverkenning: vanaf € 3.500"}
                  </Link>
                </dt>
                <dd>
                  {copy.v2_tekst_021 ??
                    "Onderzoek en afbakening voorafgaand aan een mogelijke bouwopdracht."}
                </dd>
              </dl>
              <p>
                {copy.v2_tekst_022 ??
                  "Stem vooraf af welke licenties, toegang, interne tijd en eventuele aanvullende kosten nodig zijn. De genoemde diensten geven geen recht op onbeperkte softwareontwikkeling."}
              </p>
            </>
          ),
        },
        {
          id: "nulmeting",
          title: copy.v2_tekst_003 ?? "Wat leg je vast vóór de start?",
          content: (
            <>
              <p>
                {copy.v2_tekst_023 ??
                  "Kies één werkproces en een representatieve reeks taken. Noteer volume, benodigde minuten, aantal correcties en de eisen aan een goede uitkomst. Spreek af wie meet en wanneer. Gebruik bij de eindmeting vergelijkbaar werk; een makkelijke demonstratie vergelijken met een moeilijke werkweek geeft geen bruikbaar beeld."}
              </p>
              <ul>
                <li>
                  <strong>{copy.v2_tekst_024 ?? "Tijd:"}</strong>{" "}
                  {copy.v2_tekst_025 ??
                    "voorbereiding, uitvoering, controle en herstel."}
                </li>
                <li>
                  <strong>{copy.v2_tekst_026 ?? "Kwaliteit:"}</strong>{" "}
                  {copy.v2_tekst_027 ??
                    "juistheid, volledigheid en terugkerende fouten."}
                </li>
                <li>
                  <strong>{copy.v2_tekst_028 ?? "Gebruik:"}</strong>{" "}
                  {copy.v2_tekst_029 ??
                    "hoe vaak medewerkers de nieuwe werkwijze werkelijk toepassen."}
                </li>
                <li>
                  <strong>{copy.v2_tekst_030 ?? "Beheer:"}</strong>{" "}
                  {copy.v2_tekst_031 ??
                    "tijd en kosten voor vragen, wijzigingen en storingen."}
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "voorbeeld",
          title: copy.v2_tekst_004 ?? "Een rekenvoorbeeld voor tijdwinst",
          content: (
            <>
              <p>
                {copy.v2_tekst_032 ??
                  "Dit is een fictief voorbeeld. Een taak komt honderd keer per maand voor en kost eerst twintig minuten. Na invoering kost de uitvoering acht minuten en de controle vier minuten. De nieuwe totale tijd is twaalf minuten, dus het verschil is acht minuten per taak: achthonderd minuten, oftewel dertien uur en twintig minuten per maand."}
              </p>
              <p>
                {copy.v2_tekst_033 ??
                  "Tel vervolgens de maandelijkse onderhoudstijd en kosten mee. Vrijgekomen tijd is pas nuttig als je weet welk werk ermee wordt gedaan. Het is niet automatisch een besparing op salaris of extra omzet. Bereken daarom geen terugverdientijd op basis van alleen de snelste demonstratie."}
              </p>
            </>
          ),
        },
        {
          id: "beoordelen",
          title: copy.v2_tekst_005 ?? "Wanneer is de invoering geslaagd?",
          content: (
            <>
              <p>
                {copy.v2_tekst_034 ??
                  "Beoordeel resultaat samen met kwaliteit en gebruik. Een sneller concept dat veel fouten veroorzaakt is geen verbetering. Een correcte workflow die alleen de bouwer kan bedienen, is nog niet goed overgedragen."}
              </p>
              <p>
                {copy.v2_tekst_035 ??
                  "Leg vooraf een praktisch acceptatiecriterium vast, bijvoorbeeld: de medewerker kan de taak zelfstandig uitvoeren, de proceseigenaar kan uitzonderingen afhandelen en de uitkomst voldoet aan de afgesproken controlepunten. Leg ook de uitkomst van de test vast als die tegenvalt."}
              </p>
              <p>
                {copy.v2_tekst_036 ?? "Bij het "}
                <Link href={copy.v2_link_037 ?? "/ai-groeipartner"}>
                  {copy.v2_tekst_038 ?? "groeipartnerschap"}
                </Link>{" "}
                {copy.v2_tekst_039 ??
                  "bespreken we gebruik en knelpunten periodiek. Daarmee blijft de vraag of een toepassing helpt onderdeel van het werk."}
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
    readPublished("kennis-ai-resultaat-meten"),
    readPublished("shared"),
  ]);
  return <CmsKennisAiResultaatMeten copy={copy} sharedCopy={sharedCopy} />;
}
