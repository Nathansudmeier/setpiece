"use client";

import { Button } from "@/components/ds";

type SiteFounderProps = {
  onNavigate?: (id: string) => void;
};

const CREDENTIALS = ["Eén aanspreekpunt", "Senior strateeg", "UEFA B-coach", "Almere"];

export default function SiteFounder({ onNavigate }: SiteFounderProps) {
  return (
    <section id="mens" className="sp-section sp-founder">
      <div className="sp-container">
        <div className="sp-founder__grid">
          <div className="sp-founder__portrait" data-reveal aria-hidden="true">
            <img
              src="/logos/setpiece-beeldmerk.svg"
              alt=""
              width={92}
              height={92}
            />
            <span className="sp-founder__sign">Nathan Sudmeier</span>
          </div>

          <div className="sp-founder__body">
            <p className="sp-eyebrow" data-reveal>Wie je spreekt</p>
            <h2 className="sp-h2 sp-h2--compact" data-reveal style={{ transitionDelay: "40ms" }}>
              Geen bureau in twaalf lagen. Eén aanspreekpunt.
            </h2>
            <p className="sp-founder__lead" data-reveal style={{ transitionDelay: "80ms" }}>
              Bij Setpiece praat je niet met een accountmanager. Je werkt rechtstreeks met de persoon
              die strategie, design en techniek zelf aan elkaar knoopt. Kortere lijnen, snellere
              beslissingen, werk dat klopt.
            </p>
            <p className="sp-founder__lead" data-reveal style={{ transitionDelay: "120ms" }}>
              Ik ken verenigingen van binnenuit. Als UEFA B-coach en hoofdtrainer weet ik hoe een club
              echt werkt. Die blik van binnenuit maakt het verschil, voor sport en non-profit én voor
              het MKB dat scherper wil spelen.
            </p>

            <ul className="sp-founder__creds" data-reveal style={{ transitionDelay: "160ms" }}>
              {CREDENTIALS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <div data-reveal style={{ transitionDelay: "200ms", marginTop: 28 }}>
              {onNavigate ? (
                <Button variant="primary" size="md" onClick={() => onNavigate("contact")}>
                  Plan een kennismaking
                </Button>
              ) : (
                <Button variant="primary" size="md" href="/#contact">
                  Plan een kennismaking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
