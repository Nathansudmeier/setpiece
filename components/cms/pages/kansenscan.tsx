import Image from "next/image";
import Link from "next/link";
import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";

import type { CmsCopy } from "@/lib/cms/schema";
import { readPublished } from "@/lib/cms/read";
import { sharedContent } from "@/lib/cms/shared";
import { cmsMetadata } from "@/lib/cms/read";
export async function generateMetadata() {
  return cmsMetadata("kansenscan");
}
export function CmsKansenscan({
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
    copy.tekst_001 ?? "Voorbereidingsvragenlijst.",
    copy.tekst_002 ?? "Werksessie van maximaal 90 minuten.",
    copy.tekst_003 ?? "Analyse van maximaal drie kernprocessen.",
    copy.tekst_004 ??
      "Beoordeling op tijd, kwaliteit, omzet, risico en uitvoerbaarheid.",
    copy.tekst_005 ?? "Compact AI-kansenrapport.",
    copy.tekst_006 ?? "Route voor de eerste 90 dagen.",
    copy.tekst_007 ??
      "Eén kleine werkende AI-oplossing binnen afgesproken grenzen.",
    copy.tekst_008 ?? "Besluitgesprek en duidelijk vervolgadvies.",
  ] as const;
  const CONTRIBUTION = [
    copy.tekst_009 ?? "Eén beslisser en één proceseigenaar.",
    copy.tekst_010 ?? "Maximaal drie betrokken sleutelpersonen.",
    copy.tekst_011 ?? "Drie representatieve voorbeelden van terugkerend werk.",
    copy.tekst_012 ?? "Beschikbare tijd voor werksessie en test.",
    copy.tekst_013 ?? "Veilige testgegevens of geminimaliseerde voorbeelden.",
    copy.tekst_014 ?? "Openheid over systemen, uitzonderingen en risico's.",
  ] as const;
  const PROCESS = [
    [
      copy.tekst_015 ?? "Voorbereiden",
      copy.tekst_016 ??
        "Doel, deelnemers, voorbeelden en nulmeting bevestigen.",
    ],
    [
      copy.tekst_017 ?? "Werksessie",
      copy.tekst_018 ??
        "Het huidige proces, verlies, uitzonderingen en gewenste resultaat begrijpen.",
    ],
    [
      copy.tekst_019 ?? "Beoordelen",
      copy.tekst_020 ??
        "Maximaal drie processen vergelijken op waarde, haalbaarheid en risico.",
    ],
    [
      copy.tekst_021 ?? "Verbeteren",
      copy.tekst_022 ??
        "Eén kleine AI-oplossing werkend maken en met een gebruiker testen.",
    ],
    [
      copy.tekst_023 ?? "Besluiten",
      copy.tekst_024 ??
        "Kiezen voor stoppen, zelf uitvoeren, sprint of aparte verkenning.",
    ],
  ] as const;
  const OUTSIDE_SCOPE = [
    copy.tekst_025 ?? "Juridische beoordeling.",
    copy.tekst_026 ?? "Uitgebreide gegevenskoppelingen of migraties.",
    copy.tekst_027 ?? "Volledige maatwerksoftware.",
    copy.tekst_028 ?? "Meerdere afdelingen zonder aparte afbakening.",
    copy.tekst_029 ?? "Onbeperkte wijzigingen.",
    copy.tekst_030 ??
      "Een volledige diagnose in het gratis kennismakingsgesprek.",
  ] as const;

  return (
    <WorkspoorShell
      preview={preview}
      sharedCopy={sharedCopy}
      activePath="/kansenscan"
    >
      <section className="ws-page-hero">
        <div className="ws-frame ws-page-hero__grid">
          <div>
            <p className="ws-context">{copy.tekst_031 ?? "Kansenscan"}</p>
            <h1>
              {copy.kop_032 ??
                "Binnen vijf werkdagen weten waar AI verantwoord verschil kan maken."}
            </h1>
            <p className="ws-lead">
              {copy.tekst_033 ??
                "Na de werksessie ontvang je een onderbouwde prioriteit voor AI, een eerste werkende oplossing en een route voor 90 dagen."}
            </p>
          </div>
          <aside className="ws-price-block" aria-label="Prijs en doorlooptijd">
            <span>{copy.tekst_034 ?? "Vaste investering"}</span>
            <strong>{copy.tekst_035 ?? "€ 1.250"}</strong>
            <p>{copy.tekst_036 ?? "exclusief btw"}</p>
            <hr />
            <p>
              {copy.tekst_037 ??
                "Oplevering binnen vijf werkdagen na de werksessie."}
            </p>
            <Link className="ws-button" href={copy.link_038 ?? "/contact"}>
              {copy.tekst_039 ?? "Bespreek de kansenscan"}
            </Link>
          </aside>
        </div>
      </section>

      <section className="ws-dual-list-section" aria-labelledby="receive-title">
        <div className="ws-frame ws-dual-list">
          <div>
            <p className="ws-context">
              {copy.tekst_040 ?? "Duidelijke oplevering"}
            </p>
            <h2 id="receive-title">{copy.kop_041 ?? "Wat je ontvangt"}</h2>
            <ul>
              {RECEIVES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="ws-context">
              {copy.tekst_042 ?? "Vaste eigen bijdrage"}
            </p>
            <h2>{copy.kop_043 ?? "Wat Setpiece van jou vraagt"}</h2>
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
              {copy.tekst_044 ?? "De kansenscan aan tafel"}
            </p>
            <h2 id="scan-visual-title">
              {copy.kop_045 ?? "Drie processen. Eén onderbouwde AI-kans."}
            </h2>
            <p>
              {copy.tekst_046 ??
                "Samen leggen we terugkerend werk naast elkaar. We vergelijken waarde, uitvoerbaarheid en risico voordat er een AI-oplossing wordt gekozen."}
            </p>
          </div>
          <figure>
            <Image
              src="/workspoor/kansenscan-werksessie.webp"
              alt={
                copy.tekst_047 ??
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
            <p>{copy.tekst_048 ?? "Van voorbereiding tot besluit"}</p>
            <h2 id="process-title">{copy.kop_049 ?? "Zo verloopt de scan."}</h2>
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
              {copy.tekst_050 ?? "Duidelijke grenzen"}
            </p>
            <h2 id="scope-title">{copy.kop_051 ?? "Niet inbegrepen"}</h2>
            <p className="ws-lead">
              {copy.tekst_052 ??
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
            <p className="ws-context">{copy.tekst_053 ?? "Prijs en vervolg"}</p>
            <h2 id="price-title">
              {copy.kop_054 ?? "Een zelfstandige eerste stap."}
            </h2>
          </div>
          <dl>
            <div>
              <dt>{copy.tekst_055 ?? "Investering"}</dt>
              <dd>{copy.tekst_056 ?? "€ 1.250 exclusief btw"}</dd>
            </div>
            <div>
              <dt>{copy.tekst_057 ?? "Betaling"}</dt>
              <dd>
                {copy.tekst_058 ?? "50% bij opdracht, 50% bij oplevering"}
              </dd>
            </div>
            <div>
              <dt>{copy.tekst_059 ?? "Geldigheid"}</dt>
              <dd>
                {copy.tekst_060 ?? "Een voorstel is veertien dagen geldig"}
              </dd>
            </div>
            <div>
              <dt>{copy.tekst_061 ?? "Verrekening"}</dt>
              <dd>
                {copy.tekst_062 ?? "€ 750 bij een sprintstart binnen 30 dagen"}
              </dd>
            </div>
            <div>
              <dt>{copy.tekst_063 ?? "Vervolg"}</dt>
              <dd>
                {copy.tekst_064 ??
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
              {copy.tekst_065 ?? "Veelgestelde vragen"}
            </p>
            <h2 id="scan-faq-title">
              {copy.kop_066 ?? "Voorwaarden zonder kleine lettertjes."}
            </h2>
          </div>
          <FaqList items={FAQ_ITEMS} />
        </div>
      </section>

      <ClosingCta
        sharedCopy={sharedCopy}
        title={copy.kop_067 ?? "Eerst bepalen of de scan past."}
        body={
          copy.tekst_068 ??
          "Het kennismakingsgesprek duurt maximaal 30 minuten. We verkennen het werkprobleem en controleren de voorwaarden. De diagnose begint na opdracht."
        }
      />
    </WorkspoorShell>
  );
}
export default async function KansenscanPage() {
  const [copy, sharedCopy] = await Promise.all([
    readPublished("kansenscan"),
    readPublished("shared"),
  ]);
  return <CmsKansenscan copy={copy} sharedCopy={sharedCopy} />;
}
