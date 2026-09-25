import type { ReactNode } from "react";
import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import ClosingCta from "@/components/workspoor/ClosingCta";
import FaqList from "@/components/workspoor/FaqList";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { SITE_URL } from "@/lib/seo";

type ServicePageProps = {
  path: string;
  name: string;
  title: string;
  description: string;
  price: string;
  priceNote: string;
  term: string;
  action: string;
  definition: ReactNode;
  included: readonly string[];
  required: readonly string[];
  steps: readonly (readonly [string, string])[];
  exclusions: readonly string[];
  faq: readonly { question: string; answer: string }[];
  children: ReactNode;
};

export default function ServicePage(props: ServicePageProps) {
  const url = new URL(props.path, SITE_URL).toString();
  const contact = `/contact?dienst=${props.path.slice(1)}`;

  return (
    <WorkspoorShell activePath={props.path}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${url}#service`,
            name: props.name,
            serviceType: props.name,
            description: props.description,
            url,
            provider: { "@id": new URL("/#organization", SITE_URL).toString() },
            areaServed: { "@type": "Country", name: "Nederland" },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL.toString() },
              { "@type": "ListItem", position: 2, name: props.name, item: url },
            ],
          },
        ],
      }} />

      <section className="ws-page-hero">
        <div className="ws-frame ws-page-hero__grid">
          <div>
            <nav className="ws-breadcrumb" aria-label="Broodkruimel">
              <Link href="/">Home</Link><span aria-hidden="true">/</span><span>{props.name}</span>
            </nav>
            <p className="ws-context">{props.name}</p>
            <h1>{props.title}</h1>
            <p className="ws-lead">{props.description}</p>
          </div>
          <aside className="ws-price-block" aria-label="Investering en afbakening">
            <span>Investering</span>
            <strong>{props.price}</strong>
            <p>{props.priceNote}</p>
            <hr />
            <p>{props.term}</p>
            <Link className="ws-button" href={contact}>{props.action}</Link>
          </aside>
        </div>
      </section>

      <section className="ws-literacy-section ws-literacy-section--mist">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Voor B2B-dienstverleners</p><h2>Wanneer past deze stap?</h2></div>
          <div>{props.definition}</div>
        </div>
      </section>

      <section className="ws-dual-list-section" aria-labelledby="service-included">
        <div className="ws-frame ws-dual-list">
          <div><p className="ws-context">Oplevering</p><h2 id="service-included">Wat je ontvangt</h2><ul>{props.included.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><p className="ws-context">Samen uitvoeren</p><h2>Wat je zelf organiseert</h2><ul>{props.required.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="ws-literacy-section ws-literacy-section--dark" aria-labelledby="service-process">
        <div className="ws-frame ws-literacy-split">
          <div><p className="ws-context">Werkwijze</p><h2 id="service-process">Van afspraak naar controleerbaar resultaat.</h2><p>We leggen vast wie beslist, wat wordt getest en wanneer de volgende stap verantwoord is.</p></div>
          <ol className="ws-literacy-steps">{props.steps.map(([title, body], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
        </div>
      </section>

      {props.children}

      <section className="ws-scope-section" aria-labelledby="service-scope">
        <div className="ws-frame ws-scope-grid">
          <div><p className="ws-context">Duidelijke grenzen</p><h2 id="service-scope">Wat buiten de opdracht valt</h2><p className="ws-lead">Extra werk krijgt vooraf een eigen afbakening, prijs en planning.</p></div>
          <ul>{props.exclusions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="ws-faq-section" aria-labelledby="service-faq">
        <div className="ws-frame ws-faq-grid"><div><p className="ws-context">Veelgestelde vragen</p><h2 id="service-faq">Duidelijkheid vóór je begint.</h2></div><FaqList items={props.faq} /></div>
      </section>
      <ClosingCta title="Bespreek het werk dat je wilt verbeteren." body="Nathan verkent of de opdracht, het eigenaarschap en de beschikbare tijd passen. De inhoudelijke diagnose en uitvoering beginnen na opdracht." href={contact} label={props.action} />
    </WorkspoorShell>
  );
}
