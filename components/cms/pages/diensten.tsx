import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import ClosingCta from "@/components/workspoor/ClosingCta";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";

const baseMetadata = createPageMetadata({
  title: "AI-diensten: advies, implementatie en teamtraining",
  description:
    "Vergelijk de AI-kansenscan, implementatiesprint, groeipartnerschap en teamtraining van Setpiece. Heldere prijzen, scope en een passende volgende stap.",
  path: "/diensten",
});
export async function generateMetadata() {
  return cmsMetadata("diensten", baseMetadata);
}
export async function CmsDiensten({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { SERVICE_ROUTE } = sharedContent(sharedCopy);

  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath="/diensten"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
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
              name: "Diensten",
              item: new URL("/diensten", SITE_URL).toString(),
            },
          ],
        }}
      />
      <section className="ws-page-hero">
        <div className="ws-frame">
          <p className="ws-context">
            {copy.v2_tekst_001 ?? "AI-advies, uitvoering en leren"}
          </p>
          <h1>
            {copy.v2_tekst_002 ?? "De juiste stap voor het werk dat beter kan."}
          </h1>
          <p className="ws-lead">
            {copy.v2_tekst_003 ??
              "Setpiece helpt B2B-dienstverleners met 15 tot 75 medewerkers om terugkerend werk te verbeteren. Begin bij een concrete vraag: waar zit de kans, hoe maken we die werkend of wat moet het team leren?"}
          </p>
          <p>
            {copy.v2_tekst_004 ??
              "De kansenscan, implementatiesprint en het groeipartnerschap vormen één route. Training is een eigen ingang voor teams die beter en zorgvuldiger met AI willen werken."}
          </p>
        </div>
      </section>
      <section className="ws-literacy-section">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>{copy.v2_tekst_005 ?? "Van inzicht naar dagelijks gebruik"}</p>
            <h2>{copy.v2_tekst_006 ?? "Vergelijk de drie stappen."}</h2>
          </div>
          <div className="ws-service-route">
            {SERVICE_ROUTE.map((service) => (
              <article key={service.href}>
                <div>
                  <span>{service.note}</span>
                  <h3>
                    <Link href={service.href}>{service.name}</Link>
                  </h3>
                </div>
                <p>{service.when}</p>
                <p>{service.result}</p>
                <strong>{service.price}</strong>
                <Link className="ws-text-link" href={service.href}>
                  {copy.v2_tekst_007 ?? "Bekijk scope en oplevering"}
                </Link>
              </article>
            ))}
          </div>
          <p className="ws-route-note">
            {copy.v2_tekst_008 ??
              "Alle bedragen zijn exclusief btw. De scan wordt binnen vijf werkdagen na de werksessie opgeleverd; de sprint duurt vier weken. Het groeipartnerschap heeft een looptijd van minimaal zes maanden. Je beslist per stap over vervolg."}
          </p>
        </div>
      </section>
      <section className="ws-literacy-section ws-literacy-section--mist">
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_009 ?? "Vaardigheden en werkafspraken"}
            </p>
            <h2>{copy.v2_tekst_010 ?? "AI-geletterdheid voor medewerkers."}</h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_011 ??
                "Een teamtraining van drie uur voor maximaal twaalf deelnemers. We oefenen met twee werksituaties, leggen afspraken vast en bespreken na ongeveer dertig dagen het gebruik. Voor een eerste kennismaking met het onderwerp is een lezing van zestig minuten beschikbaar."}
            </p>
            <p>
              {copy.v2_tekst_012 ??
                "Prijs op aanvraag, afgestemd op werkvorm en situatie."}
            </p>
            <Link
              className="ws-text-link"
              href={copy.v2_link_013 ?? "/ai-geletterdheid"}
            >
              {copy.v2_tekst_014 ?? "Bekijk teamtraining en lezing"}
            </Link>
          </div>
        </div>
      </section>
      <section className="ws-literacy-section">
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_015 ?? "Als standaardoplossingen tekortschieten"}
            </p>
            <h2>
              {copy.v2_tekst_016 ?? "Eerst onderzoeken of maatwerk past."}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_017 ??
                "Een complexere toepassing vraagt een afzonderlijke verkenning. We onderzoeken werkproces, gebruikers, gegevens, rollen en technische haalbaarheid voordat een bouwopdracht wordt begroot. De maatwerkverkenning begint vanaf € 3.500 exclusief btw."}
            </p>
            <Link
              className="ws-text-link"
              href={copy.v2_link_018 ?? "/ai-maatwerk"}
            >
              {copy.v2_tekst_019 ?? "Bekijk de maatwerkverkenning"}
            </Link>
          </div>
        </div>
      </section>
      <section className="ws-literacy-section ws-literacy-section--mist">
        <div className="ws-frame">
          <h2>{copy.v2_tekst_020 ?? "Welke dienst past bij jouw vraag?"}</h2>
          <ul>
            <li>
              <strong>
                {copy.v2_tekst_021 ?? "De prioriteit is nog onduidelijk:"}
              </strong>{" "}
              {copy.v2_tekst_022 ?? "start met de "}
              <Link href={copy.v2_link_023 ?? "/kansenscan"}>
                {copy.v2_tekst_024 ?? "betaalde kansenscan"}
              </Link>
              {copy.v2_tekst_025 ?? "."}
            </li>
            <li>
              <strong>
                {copy.v2_tekst_026 ?? "Het proces en doel zijn gekozen:"}
              </strong>{" "}
              {copy.v2_tekst_027 ?? "bekijk de "}
              <Link href={copy.v2_link_028 ?? "/ai-implementatie"}>
                {copy.v2_tekst_029 ?? "implementatiesprint"}
              </Link>
              {copy.v2_tekst_030 ??
                "; we toetsen eerst of de uitgangssituatie voldoende helder is."}
            </li>
            <li>
              <strong>{copy.v2_tekst_031 ?? "Een werkwijze draait al:"}</strong>{" "}
              {copy.v2_tekst_032 ?? "bespreek "}
              <Link href={copy.v2_link_033 ?? "/ai-groeipartner"}>
                {copy.v2_tekst_034 ?? "begeleiding en gebruikscontrole"}
              </Link>
              {copy.v2_tekst_035 ?? "."}
            </li>
            <li>
              <strong>
                {copy.v2_tekst_036 ?? "Het team heeft vragen over AI-gebruik:"}
              </strong>{" "}
              {copy.v2_tekst_037 ?? "kies een "}
              <Link href={copy.v2_link_038 ?? "/ai-geletterdheid"}>
                {copy.v2_tekst_039 ?? "training of lezing"}
              </Link>
              {copy.v2_tekst_040 ?? "."}
            </li>
          </ul>
          <p>
            {copy.v2_tekst_041 ?? "Lees ook "}
            <Link href={copy.v2_link_042 ?? "/werkwijze"}>
              {copy.v2_tekst_043 ?? "hoe we samenwerken"}
            </Link>
            {copy.v2_tekst_044 ?? ", "}
            <Link href={copy.v2_link_045 ?? "/praktijkvoorbeelden"}>
              {copy.v2_tekst_046 ?? "de praktijkvoorbeelden"}
            </Link>{" "}
            {copy.v2_tekst_047 ?? "en onze "}
            <Link href={copy.v2_link_048 ?? "/kennis"}>
              {copy.v2_tekst_049 ?? "praktische uitleg"}
            </Link>
            {copy.v2_tekst_050 ?? "."}
          </p>
        </div>
      </section>
      <ClosingCta sharedCopy={sharedCopy} />
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("diensten"),
    readPublished("shared"),
  ]);
  return <CmsDiensten copy={copy} sharedCopy={sharedCopy} />;
}
