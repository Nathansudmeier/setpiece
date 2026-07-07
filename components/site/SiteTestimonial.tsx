"use client";

import { BigQuote } from "@/components/ds";

export default function SiteTestimonial() {
  return (
    <section className="sp-section" style={{ background: "var(--color-nacht)", position: "relative", overflow: "hidden" }}>
      <div className="sp-container" style={{ maxWidth: 760, textAlign: "center" }}>
        <div className="sp-testimonial-frame" data-reveal>
          <BigQuote variant="dark" by="Bestuurslid, brancheorganisatie">
            Setpiece zette in zes weken een positionering neer die het hele bestuur zelf kan uitleggen. Geen jargon, wel resultaat.
          </BigQuote>
        </div>
      </div>
    </section>
  );
}
