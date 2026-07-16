import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteCaseDetail from "@/components/site/SiteCaseDetail";
import { createPageMetadata } from "@/lib/seo";
import "../../styles/nankaro.css";

export const metadata = createPageMetadata({
  title: "Website en huisstijl voor een scale-up",
  description: "Een geanonimiseerde Setpiece-case over een schaalbare huisstijl en website, van eerste schets tot livegang in acht weken.",
  path: "/cases/digitale-identiteit",
});

export default function Page() {
  return (
    <div data-screen-label="Case — Digitale identiteit">
      <SiteNav mode="page" />
      <main id="main-content">
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
        path="/cases/digitale-identiteit"
        />
      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
