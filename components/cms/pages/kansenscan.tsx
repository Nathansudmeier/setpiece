import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import {
  createBreadcrumbSchema,
  createPageMetadata,
  ORGANIZATION_ID,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/seo";
import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";

const baseMetadata = createPageMetadata({
  title: "AI-kansenscan voor betere werkprocessen",
  description:
    "Binnen vijf werkdagen een onderbouwde AI-kans, een eerste werkende oplossing en een route voor 90 dagen.",
  path: "/kansenscan",
});
export async function generateMetadata() {
  return cmsMetadata("kansenscan", baseMetadata);
}
export async function CmsKansenscan({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { FAQ_ITEMS } = sharedContent(sharedCopy);
  const RECEIVES = [
    copy.v2_tekst_001 ?? "Voorbereidingsvragenlijst.",
    copy.v2_tekst_002 ?? "Werksessie van maximaal 90 minuten.",
    copy.v2_tekst_003 ?? "Analyse van maximaal drie kernprocessen.",
    copy.v2_tekst_004 ??
      "Beoordeling op tijd, kwaliteit, omzet, risico en uitvoerbaarheid.",
    copy.v2_tekst_005 ?? "Compact AI-kansenrapport.",
    copy.v2_tekst_006 ?? "Route voor de eerste 90 dagen.",
    copy.v2_tekst_007 ??
      "Eén kleine werkende AI-oplossing binnen afgesproken grenzen.",
    copy.v2_tekst_008 ?? "Besluitgesprek en duidelijk vervolgadvies.",
  ] as const;
  const CONTRIBUTION = [
    copy.v2_tekst_009 ?? "Eén beslisser en één proceseigenaar.",
    copy.v2_tekst_010 ?? "Maximaal drie betrokken sleutelpersonen.",
    copy.v2_tekst_011 ??
      "Drie representatieve voorbeelden van terugkerend werk.",
    copy.v2_tekst_012 ?? "Beschikbare tijd voor werksessie en test.",
    copy.v2_tekst_013 ??
      "Veilige testgegevens of geminimaliseerde voorbeelden.",
    copy.v2_tekst_014 ?? "Openheid over systemen, uitzonderingen en risico's.",
  ] as const;
  const PROCESS = [
    [
      copy.v2_tekst_015 ?? "Voorbereiden",
      copy.v2_tekst_016 ??
        "Doel, deelnemers, voorbeelden en nulmeting bevestigen.",
    ],
    [
      copy.v2_tekst_017 ?? "Werksessie",
      copy.v2_tekst_018 ??
        "Het huidige proces, verlies, uitzonderingen en gewenste resultaat begrijpen.",
    ],
    [
      copy.v2_tekst_019 ?? "Beoordelen",
      copy.v2_tekst_020 ??
        "Maximaal drie processen vergelijken op waarde, haalbaarheid en risico.",
    ],
    [
      copy.v2_tekst_021 ?? "Verbeteren",
      copy.v2_tekst_022 ??
        "Eén kleine AI-oplossing werkend maken en met een gebruiker testen.",
    ],
    [
      copy.v2_tekst_023 ?? "Besluiten",
      copy.v2_tekst_024 ??
        "Kiezen voor stoppen, zelf uitvoeren, sprint of aparte verkenning.",
    ],
  ] as const;
  const OUTSIDE_SCOPE = [
    copy.v2_tekst_025 ?? "Juridische beoordeling.",
    copy.v2_tekst_026 ?? "Uitgebreide gegevenskoppelingen of migraties.",
    copy.v2_tekst_027 ?? "Volledige maatwerksoftware.",
    copy.v2_tekst_028 ?? "Meerdere afdelingen zonder aparte afbakening.",
    copy.v2_tekst_029 ?? "Onbeperkte wijzigingen.",
    copy.v2_tekst_030 ??
      "Een volledige diagnose in het gratis kennismakingsgesprek.",
  ] as const;

  return (
    <WorkspoorShell
      sharedCopy={sharedCopy}
      preview={preview}
      activePath="/kansenscan"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": new URL("/kansenscan#service", SITE_URL).toString(),
              name: "AI-kansenscan",
              serviceType: "AI-kansenscan voor betere werkprocessen",
              description:
                "Analyse van maximaal drie werkprocessen, één onderbouwde AI-kans, een kleine werkende verbetering en een route voor 90 dagen.",
              url: new URL("/kansenscan", SITE_URL).toString(),
              provider: { "@id": ORGANIZATION_ID },
              areaServed: { "@type": "Country", name: "Nederland" },
              offers: {
                "@type": "Offer",
                url: new URL("/kansenscan", SITE_URL).toString(),
                price: "1250",
                priceCurrency: "EUR",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  price: "1250",
                  priceCurrency: "EUR",
                  valueAddedTaxIncluded: false,
                },
              },
            },
            {
              "@type": "WebPage",
              "@id": new URL("/kansenscan#webpage", SITE_URL).toString(),
              url: new URL("/kansenscan", SITE_URL).toString(),
              name: "AI-kansenscan voor betere werkprocessen",
              inLanguage: "nl-NL",
              isPartOf: { "@id": WEBSITE_ID },
              mainEntity: {
                "@id": new URL("/kansenscan#service", SITE_URL).toString(),
              },
            },
            createBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "AI-kansenscan", path: "/kansenscan" },
            ]),
          ],
        }}
      />
      <section className="ws-page-hero">
        <div className="ws-frame ws-page-hero__grid">
          <div>
            <nav className="ws-breadcrumb" aria-label="Broodkruimel">
              <Link href="/">{copy.v2_tekst_031 ?? "Home"}</Link>
              <span aria-hidden="true">{copy.v2_tekst_032 ?? "/"}</span>
              <span>{copy.v2_tekst_033 ?? "AI-kansenscan"}</span>
            </nav>
            <p className="ws-context">{copy.v2_tekst_034 ?? "Kansenscan"}</p>
            <h1>
              {copy.v2_tekst_035 ??
                "Binnen vijf werkdagen weten waar AI verantwoord verschil kan maken."}
            </h1>
            <p className="ws-lead">
              {copy.v2_tekst_036 ??
                "Een AI-kansenscan is een afgebakend onderzoek naar waar AI jouw dagelijkse werk kan verbeteren. We vergelijken maximaal drie processen. Na de werksessie ontvang je een onderbouwde prioriteit, een kleine werkende oplossing en een route voor 90 dagen."}
            </p>
          </div>
          <aside className="ws-price-block" aria-label="Prijs en doorlooptijd">
            <span>{copy.v2_tekst_037 ?? "Vaste investering"}</span>
            <strong>{copy.v2_tekst_038 ?? "€ 1.250"}</strong>
            <p>{copy.v2_tekst_039 ?? "exclusief btw"}</p>
            <hr />
            <p>
              {copy.v2_tekst_040 ??
                "Oplevering binnen vijf werkdagen na de werksessie."}
            </p>
            <Link className="ws-button" href={copy.v2_link_041 ?? "/contact"}>
              {copy.v2_tekst_042 ?? "Bespreek de kansenscan"}
            </Link>
          </aside>
        </div>
      </section>

      <section className="ws-dual-list-section" aria-labelledby="receive-title">
        <div className="ws-frame ws-dual-list">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_043 ?? "Duidelijke oplevering"}
            </p>
            <h2 id="receive-title">{copy.v2_tekst_044 ?? "Wat je ontvangt"}</h2>
            <ul>
              {RECEIVES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="ws-context">
              {copy.v2_tekst_045 ?? "Vaste eigen bijdrage"}
            </p>
            <h2>{copy.v2_tekst_046 ?? "Wat Setpiece van jou vraagt"}</h2>
            <ul>
              {CONTRIBUTION.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ws-scan-visual" aria-labelledby="scan-visual-title">
        <div className="ws-frame ws-scan-visual__grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_047 ?? "De kansenscan aan tafel"}
            </p>
            <h2 id="scan-visual-title">
              {copy.v2_tekst_048 ?? "Drie processen. Eén onderbouwde AI-kans."}
            </h2>
            <p>
              {copy.v2_tekst_049 ??
                "Samen leggen we terugkerend werk naast elkaar. We vergelijken waarde, uitvoerbaarheid en risico voordat er een AI-oplossing wordt gekozen."}
            </p>
            <p className="ws-image-note">
              {copy.v2_tekst_050 ??
                "Illustratief werkbeeld; geen fotografie van een klantopdracht."}
            </p>
          </div>
          <figure>
            <Image
              src="/workspoor/kansenscan-werksessie.webp"
              alt={
                copy.v2_tekst_051 ??
                "Drie professionals vergelijken werkprocessen tijdens een kansenscan"
              }
              fill
              sizes="(max-width: 800px) 100vw, 58vw"
            />
          </figure>
        </div>
      </section>

      <section className="ws-process-field" aria-labelledby="process-title">
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>{copy.v2_tekst_052 ?? "Van voorbereiding tot besluit"}</p>
            <h2 id="process-title">
              {copy.v2_tekst_053 ?? "Zo verloopt de scan."}
            </h2>
          </div>
          <ol className="ws-process-list">
            {PROCESS.map(([title, text], index) => (
              <li key={title} className={index === 3 ? "is-active" : undefined}>
                <span aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ws-scope-section" aria-labelledby="scope-title">
        <div className="ws-frame ws-scope-grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_054 ?? "Duidelijke grenzen"}
            </p>
            <h2 id="scope-title">{copy.v2_tekst_055 ?? "Niet inbegrepen"}</h2>
            <p className="ws-lead">
              {copy.v2_tekst_056 ??
                "Een kleine scope houdt de scan snel, eerlijk en betaalbaar. Groter werk krijgt eerst een aparte afbakening."}
            </p>
          </div>
          <ul>
            {OUTSIDE_SCOPE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ws-price-section" aria-labelledby="price-title">
        <div className="ws-frame ws-price-grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_057 ?? "Prijs en vervolg"}
            </p>
            <h2 id="price-title">
              {copy.v2_tekst_058 ?? "Een zelfstandige eerste stap."}
            </h2>
          </div>
          <dl>
            <div>
              <dt>{copy.v2_tekst_059 ?? "Investering"}</dt>
              <dd>{copy.v2_tekst_060 ?? "€ 1.250 exclusief btw"}</dd>
            </div>
            <div>
              <dt>{copy.v2_tekst_061 ?? "Betaling"}</dt>
              <dd>
                {copy.v2_tekst_062 ?? "50% bij opdracht, 50% bij oplevering"}
              </dd>
            </div>
            <div>
              <dt>{copy.v2_tekst_063 ?? "Geldigheid"}</dt>
              <dd>
                {copy.v2_tekst_064 ?? "Een voorstel is veertien dagen geldig"}
              </dd>
            </div>
            <div>
              <dt>{copy.v2_tekst_065 ?? "Verrekening"}</dt>
              <dd>
                {copy.v2_tekst_066 ??
                  "€ 750 bij een sprintstart binnen 30 dagen"}
              </dd>
            </div>
            <div>
              <dt>{copy.v2_tekst_067 ?? "Vervolg"}</dt>
              <dd>
                {copy.v2_tekst_068 ??
                  "De scan verplicht niet tot een volgende opdracht"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="ws-faq-section" aria-labelledby="scan-faq-title">
        <div className="ws-frame ws-faq-grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_069 ?? "Veelgestelde vragen"}
            </p>
            <h2 id="scan-faq-title">
              {copy.v2_tekst_070 ?? "Voorwaarden zonder kleine lettertjes."}
            </h2>
          </div>
          <FaqList items={FAQ_ITEMS} />
        </div>
      </section>

      <ClosingCta
        sharedCopy={sharedCopy}
        title={copy.v2_tekst_071 ?? "Eerst bepalen of de scan past."}
        body={
          copy.v2_tekst_072 ??
          "Het kennismakingsgesprek duurt maximaal 30 minuten. We verkennen het werkprobleem en controleren de voorwaarden. De diagnose begint na opdracht."
        }
      />
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("kansenscan"),
    readPublished("shared"),
  ]);
  return <CmsKansenscan copy={copy} sharedCopy={sharedCopy} />;
}
