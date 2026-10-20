/*
THESIS: Eén zichtbaar werkspoor verandert terugkerende frictie in een geborgde werkwijze; geen generieke advieshero of dienstenkaartjes.
OWN-WORLD: Paper en Ink bezitten grote velden. Signal Rose markeert de ene ingreep. Scherpe lijnen, vlak bewijs en het zeshoekige merk dragen de vorm.
STORY: Herken verlies, zie onderbouwd bewijs, begrijp de kansenscan, volg de route en bespreek de passende eerste stap.
FIRST VIEWPORT: Een brede belofte beslaat het raster; de scanfeiten vormen één beslisregel eronder. De primaire actie staat direct naast de termijn en prijs.
FORM: Richting B, verticale overdracht, was de structurele winnaar. Richting C levert de Ink/Paper-kruisingen. Door gebruiker goedgekeurd; er is geen seed key voor deze aangeleverde handoff.
*/

import Image from "next/image";
import Link from "next/link";
import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished, cmsMetadata } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";

export async function generateMetadata() {
  return cmsMetadata("home");
}
export async function CmsHome({
  copy,
  sharedCopy,
  preview = false,
}: {
  copy: CmsCopy;
  sharedCopy: CmsCopy;
  preview?: boolean;
}) {
  const { FAQ_ITEMS, HOME_PROOF, SERVICE_ROUTE, WORKLINE_STEPS } =
    sharedContent(sharedCopy);
  const PROBLEMS = [
    copy.v2_tekst_001 ??
      "Medewerkers verzamelen dezelfde informatie uit meerdere systemen.",
    copy.v2_tekst_002 ??
      "Offertes, rapportages of communicatie blijven te lang liggen.",
    copy.v2_tekst_003 ?? "Kwaliteit hangt sterk af van één ervaren collega.",
    copy.v2_tekst_004 ?? "Losse AI-experimenten worden geen vaste werkwijze.",
    copy.v2_tekst_005 ??
      "De directie ziet mogelijkheden, maar mist een verantwoorde eerste keuze.",
  ] as const;
  const FITS = [
    copy.v2_tekst_006 ?? "Er is een herkenbaar terugkerend werkprobleem.",
    copy.v2_tekst_007 ?? "Een beslisser en proceseigenaar zijn betrokken.",
    copy.v2_tekst_008 ?? "Medewerkers krijgen tijd voor de werksessie en test.",
    copy.v2_tekst_009 ??
      "Veilige voorbeelden of testgegevens zijn beschikbaar.",
    copy.v2_tekst_010 ?? "Er is budget voor een mogelijke vervolgstap.",
  ] as const;
  const DOES_NOT_FIT = [
    copy.v2_tekst_011 ?? "De organisatie zoekt alleen vrijblijvende ideeën.",
    copy.v2_tekst_012 ?? "Er wordt geen eigenaar aangewezen.",
    copy.v2_tekst_013 ?? "Er is geen tijd voor testen en invoering.",
  ] as const;

  return (
    <WorkspoorShell sharedCopy={sharedCopy} preview={preview}>
      <section className="ws-home-hero" aria-labelledby="home-title">
        <div className="ws-frame">
          <div className="ws-hero__signal" aria-hidden="true">
            <span />
          </div>
          <p className="ws-context">
            {copy.v2_tekst_014 ??
              "AI Consultancy voor B2B-dienstverleners met 15 tot 75 medewerkers"}
          </p>
          <h1 id="home-title">
            {copy.v2_tekst_015 ?? "Maak dagelijks werk"}
            <span>{copy.v2_tekst_016 ?? "eenvoudiger en beter met AI."}</span>
          </h1>
          <div className="ws-hero__intro">
            <p>
              {copy.v2_tekst_017 ??
                "Setpiece onderzoekt waar terugkerend werk vastloopt, bouwt een passende AI-oplossing of workflow en maakt die samen met medewerkers werkend en overdraagbaar."}
            </p>
            <Link
              className="ws-text-link"
              href={copy.v2_link_018 ?? "/werkwijze"}
            >
              {copy.v2_tekst_019 ?? "Zie hoe het werkspoor loopt"}
            </Link>
          </div>

          <div className="ws-decision-rail" aria-label="Kern van de kansenscan">
            <div>
              <span>{copy.v2_tekst_020 ?? "Investering"}</span>
              <strong>{copy.v2_tekst_021 ?? "€ 1.250 excl. btw"}</strong>
            </div>
            <div>
              <span>{copy.v2_tekst_022 ?? "Na de werksessie"}</span>
              <strong>{copy.v2_tekst_023 ?? "5 werkdagen"}</strong>
            </div>
            <div>
              <span>{copy.v2_tekst_024 ?? "Richting"}</span>
              <strong>{copy.v2_tekst_025 ?? "90-dagenroute"}</strong>
            </div>
            <div>
              <span>{copy.v2_tekst_026 ?? "Eerste bewijs"}</span>
              <strong>{copy.v2_tekst_027 ?? "1 werkende AI-oplossing"}</strong>
            </div>
            <Link className="ws-button" href={copy.v2_link_028 ?? "/contact"}>
              {copy.v2_tekst_029 ?? "Bespreek de kansenscan"}
            </Link>
          </div>
        </div>
      </section>

      <section className="ws-proof-field" aria-labelledby="proof-title">
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>{copy.v2_tekst_030 ?? "Resultaten uit dagelijks werk"}</p>
            <h2 id="proof-title">
              {copy.v2_tekst_031 ?? "Bewijs vóór belofte."}
            </h2>
            <Link
              className="ws-text-link ws-text-link--paper"
              href={copy.v2_link_032 ?? "/praktijkvoorbeelden"}
            >
              {copy.v2_tekst_033 ?? "Bekijk de volledige context"}
            </Link>
          </div>
          <div className="ws-proof-grid">
            {HOME_PROOF.map((item) => (
              <article key={item.result + item.title} className="ws-proof">
                <p className="ws-proof__result">{item.result}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <small>{item.context}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ws-problem-section" aria-labelledby="problem-title">
        <div className="ws-frame ws-problem-grid">
          <div className="ws-sticky-heading">
            <p className="ws-context">
              {copy.v2_tekst_034 ?? "Waar werk dagelijks lekt"}
            </p>
            <h2 id="problem-title">
              {copy.v2_tekst_035 ??
                "Geen groot systeemprobleem. Wel iedere week verlies."}
            </h2>
          </div>
          <ol className="ws-friction-list">
            {PROBLEMS.map((problem) => (
              <li key={problem}>
                <span className="ws-stop-mark" aria-hidden="true" />
                <p>{problem}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="ai-consultancy"
        className="ws-photo-crossing"
        aria-label="De aanpak van Setpiece"
      >
        <div className="ws-frame ws-photo-crossing__grid">
          <div className="ws-photo-crossing__statement">
            <p>{copy.v2_tekst_036 ?? "AI Consultancy in het echte werk."}</p>
            <h2>{copy.v2_tekst_037 ?? "AI begint bij het proces."}</h2>
            <span>
              {copy.v2_tekst_038 ??
                "Eerst begrijpen wat mensen doen en waar het stokt. Dan de juiste AI-oplossing bouwen, testen en overdragen aan de mensen die ermee werken."}
            </span>
            <p className="ws-image-note">
              {copy.v2_tekst_039 ??
                "Illustratieve werkbeelden; geen fotografie van klantopdrachten."}
            </p>
          </div>
          <div className="ws-photo-crossing__media">
            <figure className="ws-photo-crossing__wide">
              <Image
                src="/workspoor/werkcontext-breed.webp"
                alt={
                  copy.v2_tekst_040 ??
                  "Illustratie van een team dat een werkproces bespreekt"
                }
                fill
                sizes="(max-width: 800px) 100vw, 58vw"
              />
            </figure>
            <figure className="ws-photo-crossing__detail">
              <Image
                src="/workspoor/proces-detail.webp"
                alt={
                  copy.v2_tekst_041 ??
                  "Twee professionals vergelijken processtappen op papier"
                }
                fill
                sizes="(max-width: 540px) 62vw, (max-width: 800px) 52vw, 24vw"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="ws-scan-section" aria-labelledby="scan-title">
        <div className="ws-frame ws-scan-grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_042 ?? "De beheerste eerste stap"}
            </p>
            <h2 id="scan-title">
              {copy.v2_tekst_043 ?? "Begin met één onderbouwde keuze."}
            </h2>
            <p className="ws-lead">
              {copy.v2_tekst_044 ??
                "De kansenscan onderzoekt maximaal drie kernprocessen. Binnen vijf werkdagen na de werksessie ontvang je een prioriteit, een route voor 90 dagen en één kleine werkende AI-oplossing."}
            </p>
            <div className="ws-inline-actions">
              <Link className="ws-button" href={copy.v2_link_045 ?? "/contact"}>
                {copy.v2_tekst_046 ?? "Bespreek de kansenscan"}
              </Link>
              <Link
                className="ws-text-link ws-text-link--paper"
                href={copy.v2_link_047 ?? "/kansenscan"}
              >
                {copy.v2_tekst_048 ?? "Bekijk scope en voorwaarden"}
              </Link>
            </div>
          </div>
          <dl className="ws-scan-facts">
            <div>
              <dt>{copy.v2_tekst_049 ?? "Werkgebied"}</dt>
              <dd>{copy.v2_tekst_050 ?? "Maximaal drie kernprocessen"}</dd>
            </div>
            <div>
              <dt>{copy.v2_tekst_051 ?? "Werksessie"}</dt>
              <dd>{copy.v2_tekst_052 ?? "Maximaal 90 minuten"}</dd>
            </div>
            <div>
              <dt>{copy.v2_tekst_053 ?? "Vervolg"}</dt>
              <dd>
                {copy.v2_tekst_054 ??
                  "Stoppen, zelf uitvoeren of gericht verder"}
              </dd>
            </div>
            <div>
              <dt>{copy.v2_tekst_055 ?? "Verrekening"}</dt>
              <dd>
                {copy.v2_tekst_056 ??
                  "€ 750 bij een sprintstart binnen 30 dagen"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="ws-workline-section" aria-labelledby="workline-title">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>{copy.v2_tekst_057 ?? "Van kans naar dagelijks gebruik"}</p>
            <h2 id="workline-title">
              {copy.v2_tekst_058 ?? "Iedere halte eindigt met eigenaarschap."}
            </h2>
          </div>
          <ol className="ws-workline">
            {WORKLINE_STEPS.map((step, index) => (
              <li
                key={step.label}
                className={index === 1 ? "is-active" : undefined}
              >
                <div className="ws-workline__mark" aria-hidden="true">
                  <span />
                </div>
                <p className="ws-workline__label">{step.label}</p>
                <h3>{step.state}</h3>
                <p>{step.action}</p>
                <small>
                  {copy.v2_tekst_059 ?? "Eigenaar: "}
                  {step.owner}
                </small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ws-route-section" aria-labelledby="route-title">
        <div className="ws-frame">
          <div className="ws-section-heading">
            <p>{copy.v2_tekst_060 ?? "Drie diensten, één lijn"}</p>
            <h2 id="route-title">
              {copy.v2_tekst_061 ??
                "Je koopt alleen de volgende logische stap."}
            </h2>
          </div>
          <div className="ws-service-route">
            {SERVICE_ROUTE.map((service, index) => (
              <article
                key={service.name}
                className={index === 0 ? "is-primary" : undefined}
              >
                <div>
                  <span>{service.note}</span>
                  <h3>
                    <Link href={service.href}>{service.name}</Link>
                  </h3>
                </div>
                <p>{service.when}</p>
                <p>{service.result}</p>
                <strong>{service.price}</strong>
              </article>
            ))}
          </div>
          <p className="ws-route-note">
            {copy.v2_tekst_062 ??
              "Alle bedragen zijn exclusief btw. De kansenscan is zelfstandig en verplicht niet tot vervolg."}
          </p>
        </div>
      </section>

      <section
        className="ws-literacy-section ws-literacy-section--mist"
        aria-labelledby="home-literacy-title"
      >
        <div className="ws-frame ws-literacy-split">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_063 ?? "AI-geletterdheid voor je team"}
            </p>
            <h2 id="home-literacy-title">
              {copy.v2_tekst_064 ??
                "Je team gebruikt AI. Werkt iedereen met dezelfde afspraken?"}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_065 ??
                "Met een praktische teamtraining leren medewerkers AI-uitkomsten beoordelen, veilig met gegevens omgaan en zelf blijven beslissen. Je krijgt werkafspraken en een gebruiksgesprek na dertig dagen."}
            </p>
            <p>
              {copy.v2_tekst_066 ??
                "Ook beschikbaar als lezing voor een teamdag of ondernemersbijeenkomst."}
            </p>
            <Link
              className="ws-text-link"
              href={copy.v2_link_067 ?? "/ai-geletterdheid"}
            >
              {copy.v2_tekst_068 ?? "Bekijk de training AI-geletterdheid"}
            </Link>
          </div>
        </div>
      </section>

      <section className="ws-founder-section" aria-labelledby="founder-title">
        <div className="ws-frame ws-founder-grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_069 ?? "Verantwoordelijkheid blijft zichtbaar"}
            </p>
            <h2 id="founder-title">
              {copy.v2_tekst_070 ??
                "Eén aanspreekpunt van diagnose tot overdracht."}
            </h2>
          </div>
          <div>
            <p>
              {copy.v2_tekst_071 ??
                "Setpiece is opgericht door Nathan Sudmeier. Vanuit ervaring met marketing, communicatie, strategie en productontwikkeling weet hij waar plannen in de dagelijkse praktijk vastlopen."}
            </p>
            <p>
              {copy.v2_tekst_072 ??
                "Nathan blijft verantwoordelijk voor diagnose, klantrelatie, implementatieregie en kwaliteit. Specialisten worden alleen betrokken wanneer de opdracht dat aantoonbaar vraagt."}
            </p>
            <Link className="ws-text-link" href={copy.v2_link_073 ?? "/over"}>
              {copy.v2_tekst_074 ?? "Lees waarom Setpiece bestaat"}
            </Link>
          </div>
        </div>
      </section>

      <section className="ws-fit-section" aria-labelledby="fit-title">
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>
              {copy.v2_tekst_075 ??
                "Goede afbakening voorkomt een verkeerd project"}
            </p>
            <h2 id="fit-title">
              {copy.v2_tekst_076 ?? "Past de kansenscan bij jouw organisatie?"}
            </h2>
          </div>
          <div className="ws-fit-grid">
            <div>
              <h3>{copy.v2_tekst_077 ?? "De scan past wanneer"}</h3>
              <ul>
                {FITS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{copy.v2_tekst_078 ?? "De scan past niet wanneer"}</h3>
              <ul>
                {DOES_NOT_FIT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ws-faq-section" aria-labelledby="faq-title">
        <div className="ws-frame ws-faq-grid">
          <div>
            <p className="ws-context">
              {copy.v2_tekst_079 ?? "Veelgestelde vragen"}
            </p>
            <h2 id="faq-title">
              {copy.v2_tekst_080 ?? "Duidelijk vóór de werksessie."}
            </h2>
          </div>
          <FaqList items={FAQ_ITEMS} />
        </div>
      </section>

      <ClosingCta sharedCopy={sharedCopy} />
    </WorkspoorShell>
  );
}
export default async function Page() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("home"),
    readPublished("shared"),
  ]);
  return <CmsHome copy={copy} sharedCopy={sharedCopy} />;
}
