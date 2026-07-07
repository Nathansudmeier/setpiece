import type { Metadata } from "next";

import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteCaseDetail from "@/components/site/SiteCaseDetail";

export const metadata: Metadata = {
  title: "Case: merkstrategie voor een brancheorganisatie — Setpiece",
};

export default function Page() {
  return (
    <div data-screen-label="Case — Merkstrategie">
      <SiteNav mode="page" />
      <SiteCaseDetail
        eyebrow="Merkstrategie"
        title="Merkstrategie voor een brancheorganisatie"
        lead="Van bestuurstaal naar een koers die leden meteen begrijpen."
        statNum="6 weken"
        statLabel="van eerste gesprek tot vastgestelde koers"
        sections={[
          {
            heading: "Uitdaging",
            body: "De organisatie had een sterk verleden, maar geen scherpe positionering. Bestuur en leden gebruikten allemaal andere woorden voor hetzelfde doel, en communicatie naar buiten voelde daardoor wisselend.",
          },
          {
            heading: "Aanpak",
            body: "Gesprekken met bestuur en een kerngroep leden, uitgewerkt tot een positionering in heldere taal. Getoetst bij de doelgroep voordat hij werd vastgesteld, niet erna.",
          },
          {
            heading: "Resultaat",
            body: "Een positionering die het bestuur zelf kan uitleggen, zonder jargon. De basis voor nieuwe ledencommunicatie en de website die erop volgde.",
          },
        ]}
        ctaNote="Herkenbaar? Praat met ons over jouw positionering."
      />
      <SiteFooter mode="page" />
    </div>
  );
}
