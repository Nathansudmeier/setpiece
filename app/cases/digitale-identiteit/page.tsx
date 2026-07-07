import type { Metadata } from "next";

import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteCaseDetail from "@/components/site/SiteCaseDetail";

export const metadata: Metadata = {
  title: "Case: website en huisstijl voor een scale-up — Setpiece",
};

export default function Page() {
  return (
    <div data-screen-label="Case — Digitale identiteit">
      <SiteNav mode="page" />
      <SiteCaseDetail
        eyebrow="Digitale identiteit"
        title="Website en huisstijl voor een groeiende scale-up"
        lead="Een snelgroeiend team had een merk nodig dat net zo hard meegroeide."
        statNum="8 weken"
        statLabel="van eerste schets tot huisstijl en site live"
        sections={[
          {
            heading: "Uitdaging",
            body: "Het bedrijf groeide sneller dan het merk. Elke afdeling gebruikte een andere versie van het logo en een eigen toon, online en in pitches.",
          },
          {
            heading: "Aanpak",
            body: "Eén huisstijl, vastgelegd in heldere richtlijnen, en een website die de strategie direct zichtbaar maakt in plaats van hem te verstoppen achter mooie zinnen.",
          },
          {
            heading: "Resultaat",
            body: "Een merk dat meegroeit met het team, met documentatie zodat iedere nieuwe collega dezelfde taal spreekt vanaf dag één.",
          },
        ]}
        ctaNote="Groeit jouw merk mee met je team? Laten we het bekijken."
      />
      <SiteFooter mode="page" />
    </div>
  );
}
