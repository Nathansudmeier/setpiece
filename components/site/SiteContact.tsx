"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Toast } from "@/components/ds";

export default function SiteContact() {
  const [toastVisible, setToastVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const email = "hello@setpiece.nl";
  const mailHref = "mailto:" + email + "?subject=" + encodeURIComponent("Nieuw project via setpiece.nl");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // clipboard permissions can fail silently; the address is still visible below
    }
    setToastVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToastVisible(false), 2600);
  };

  return (
    <section id="contact" className="sp-section" style={{ background: "var(--surface-page)" }}>
      <div className="sp-container" style={{ maxWidth: 820 }}>
        <div className="sp-contact-card" data-reveal>
          <span className="sp-contact-glass" aria-hidden="true"></span>
          <p className="sp-eyebrow sp-eyebrow--on-dark" style={{ textAlign: "center" }}>Trap af</p>
          <h2 className="sp-h2" style={{ textAlign: "center" }}>Laten we praten over jouw volgende kans.</h2>
          <p className="body">Mail rechtstreeks of kopieer het adres. We reageren binnen 1 werkdag.</p>
          <div className="ctas">
            <Button variant="primary" size="lg" onClick={() => { window.location.href = mailHref; }}>Trap af →</Button>
            <Button variant="on-dark" size="lg" onClick={copyEmail}>Kopieer e-mailadres</Button>
          </div>
          <p className="email-line"><a href={mailHref}>{email}</a></p>
        </div>
      </div>
      <div className={`sp-toast-holder ${toastVisible ? "is-visible" : ""}`} aria-live="polite">
        <Toast variant="highlight" title="Gekopieerd" message={`${email} staat op je klembord.`} />
      </div>
    </section>
  );
}
