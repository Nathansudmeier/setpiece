import type { Metadata } from "next";

import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteCaseDetail from "@/components/site/SiteCaseDetail";

export const metadata: Metadata = {
  title: "Case: AI-strategie voor een mkb-dienstverlener — Setpiece",
};

export default function Page() {
  return (
    <div data-screen-label="Case — AI-strategie">
      <SiteNav mode="page" />
      <SiteCaseDetail
        eyebrow="AI-strategie & advies"
        title="AI-strategie voor een mkb-dienstverlener"
        lead="Niet meer experimenteren met AI, maar gericht inzetten waar het verschil maakt."
        statNum="12 uur"
        statLabel="per week teruggewonnen in de dagelijkse operatie"
        sections={[
          {
            heading: "Uitdaging",
            body: "Het team experimenteerde los van elkaar met AI-tools, zonder duidelijk doel, eigenaarschap of manier om te meten of het hielp.",
          },
          {
            heading: "Aanpak",
            body: "Eén praktisch stappenplan: waar AI nu al waarde toevoegt, waar (nog) niet, en wie het beheert. Geen hype, wel prioriteiten.",
          },
          {
            heading: "Resultaat",
            body: "Een concreet stappenplan, gedragen door het team, met meetbare tijdswinst binnen het eerste kwartaal.",
          },
        ]}
        ctaNote="Wil je weten waar AI voor jouw organisatie verschil maakt?"
      />
      <SiteFooter mode="page" />
    </div>
  );
}
