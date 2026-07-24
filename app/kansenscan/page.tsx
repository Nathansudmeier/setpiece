import Image from "next/image";
import Link from "next/link";

import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { FAQ_ITEMS } from "@/lib/workspoor-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AI-kansenscan voor betere werkprocessen",
  description:
    "Binnen vijf werkdagen een onderbouwde AI-kans, een eerste werkende oplossing en een route voor 90 dagen.",
  path: "/kansenscan",
});

const RECEIVES = [
  "Voorbereidingsvragenlijst.",
  "Werksessie van maximaal 90 minuten.",
  "Analyse van maximaal drie kernprocessen.",
  "Beoordeling op tijd, kwaliteit, omzet, risico en uitvoerbaarheid.",
  "Compact AI-kansenrapport.",
  "Route voor de eerste 90 dagen.",
  "Eén kleine werkende AI-oplossing binnen afgesproken grenzen.",
  "Besluitgesprek en duidelijk vervolgadvies.",
] as const;

const CONTRIBUTION = [
  "Eén beslisser en één proceseigenaar.",
  "Maximaal drie betrokken sleutelpersonen.",
  "Drie representatieve voorbeelden van terugkerend werk.",
  "Beschikbare tijd voor werksessie en test.",
  "Veilige testgegevens of geminimaliseerde voorbeelden.",
  "Openheid over systemen, uitzonderingen en risico's.",
] as const;

const PROCESS = [
  ["Voorbereiden", "Doel, deelnemers, voorbeelden en nulmeting bevestigen."],
  ["Werksessie", "Het huidige proces, verlies, uitzonderingen en gewenste resultaat begrijpen."],
  ["Beoordelen", "Maximaal drie processen vergelijken op waarde, haalbaarheid en risico."],
  ["Verbeteren", "Eén kleine AI-oplossing werkend maken en met een gebruiker testen."],
  ["Besluiten", "Kiezen voor stoppen, zelf uitvoeren, sprint of aparte verkenning."],
] as const;

const OUTSIDE_SCOPE = [
  "Juridische beoordeling.",
  "Uitgebreide gegevenskoppelingen of migraties.",
  "Volledige maatwerksoftware.",
  "Meerdere afdelingen zonder aparte afbakening.",
  "Onbeperkte wijzigingen.",
  "Een volledige diagnose in het gratis kennismakingsgesprek.",
] as const;

export default function KansenscanPage() {
  return (
    <WorkspoorShell activePath="/kansenscan">
      <section className="ws-page-hero">
        <div className="ws-frame ws-page-hero__grid">
          <div>
            <p className="ws-context">Kansenscan</p>
            <h1>Binnen vijf werkdagen weten waar AI verantwoord verschil kan maken.</h1>
            <p className="ws-lead">
              Na de werksessie ontvang je een onderbouwde prioriteit voor AI, een eerste
              werkende oplossing en een route voor 90 dagen.
            </p>
          </div>
          <aside className="ws-price-block" aria-label="Prijs en doorlooptijd">
            <span>Vaste investering</span>
            <strong>€ 1.250</strong>
            <p>exclusief btw</p>
            <hr />
            <p>Oplevering binnen vijf werkdagen na de werksessie.</p>
            <Link className="ws-button" href="/contact">
              Bespreek de kansenscan
            </Link>
          </aside>
        </div>
      </section>

      <section className="ws-dual-list-section" aria-labelledby="receive-title">
        <div className="ws-frame ws-dual-list">
          <div>
            <p className="ws-context">Duidelijke oplevering</p>
            <h2 id="receive-title">Wat je ontvangt</h2>
            <ul>
              {RECEIVES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="ws-context">Vaste eigen bijdrage</p>
            <h2>Wat Setpiece van jou vraagt</h2>
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
            <p className="ws-context">De kansenscan aan tafel</p>
            <h2 id="scan-visual-title">Drie processen. Eén onderbouwde AI-kans.</h2>
            <p>
              Samen leggen we terugkerend werk naast elkaar. We vergelijken waarde,
              uitvoerbaarheid en risico voordat er een AI-oplossing wordt gekozen.
            </p>
          </div>
          <figure>
            <Image
              src="/workspoor/kansenscan-werksessie.webp"
              alt="Drie professionals vergelijken werkprocessen tijdens een kansenscan"
              fill
              sizes="(max-width: 800px) 100vw, 58vw"
            />
          </figure>
        </div>
      </section>

      <section className="ws-process-field" aria-labelledby="process-title">
        <div className="ws-frame">
          <div className="ws-section-heading ws-section-heading--dark">
            <p>Van voorbereiding tot besluit</p>
            <h2 id="process-title">Zo verloopt de scan.</h2>
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
            <p className="ws-context">Duidelijke grenzen</p>
            <h2 id="scope-title">Niet inbegrepen</h2>
            <p className="ws-lead">
              Een kleine scope houdt de scan snel, eerlijk en betaalbaar. Groter werk krijgt
              eerst een aparte afbakening.
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
            <p className="ws-context">Prijs en vervolg</p>
            <h2 id="price-title">Een zelfstandige eerste stap.</h2>
          </div>
          <dl>
            <div>
              <dt>Investering</dt>
              <dd>€ 1.250 exclusief btw</dd>
            </div>
            <div>
              <dt>Betaling</dt>
              <dd>50% bij opdracht, 50% bij oplevering</dd>
            </div>
            <div>
              <dt>Geldigheid</dt>
              <dd>Een voorstel is veertien dagen geldig</dd>
            </div>
            <div>
              <dt>Verrekening</dt>
              <dd>€ 750 bij een sprintstart binnen 30 dagen</dd>
            </div>
            <div>
              <dt>Vervolg</dt>
              <dd>De scan verplicht niet tot een volgende opdracht</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="ws-faq-section" aria-labelledby="scan-faq-title">
        <div className="ws-frame ws-faq-grid">
          <div>
            <p className="ws-context">Veelgestelde vragen</p>
            <h2 id="scan-faq-title">Voorwaarden zonder kleine lettertjes.</h2>
          </div>
          <FaqList items={FAQ_ITEMS} />
        </div>
      </section>

      <ClosingCta
        title="Eerst bepalen of de scan past."
        body="Het kennismakingsgesprek duurt maximaal 30 minuten. We verkennen het werkprobleem en controleren de voorwaarden. De diagnose begint na opdracht."
      />
    </WorkspoorShell>
  );
}
