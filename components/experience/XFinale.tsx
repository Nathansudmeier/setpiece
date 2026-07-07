"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Toast } from "@/components/ds";
import { XMagnetic } from "./XHero";

type Audience = "onderneming" | "vereniging";

const XFINALE_SUBS: Record<Audience, string> = {
  onderneming: 'Elke kans voorbereid. Nu die van jouw onderneming. Mail rechtstreeks, je krijgt binnen één werkdag antwoord.',
  vereniging: 'Elke kans voorbereid. Nu die van jouw vereniging. Mail rechtstreeks, je krijgt binnen één werkdag antwoord.',
};

export default function XFinale({ audience = 'onderneming' }: { audience: Audience }) {
  const [toastVisible, setToastVisible] = useState(false);
  const [shots, setShots] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const email = 'hello@setpiece.nl';
  const mailHref = 'mailto:' + email + '?subject=' + encodeURIComponent(`Nieuw project via setpiece.nl (${audience})`);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(email); } catch { /* adres staat eronder */ }
    setToastVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToastVisible(false), 2600);
  };

  return (
    <section id="contact" className="xp-section xp-finale" data-screen-label="Contact">
      <div className="xp-finale__inner" data-reveal>
        <button
          type="button"
          className="xp-finale__targetbtn"
          onClick={() => setShots((s) => s + 1)}
          aria-label="Schiet de bal op het doel"
          title="Klik: schiet op doel"
        >
          <svg key={shots} className="xp-finale__target" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="ring ring--1" cx="60" cy="60" r="54" fill="none" stroke="var(--color-amber)" strokeOpacity="0.3" strokeWidth="2"></circle>
            <circle className="ring ring--2" cx="60" cy="60" r="36" fill="none" stroke="var(--color-amber)" strokeWidth="2" strokeDasharray="5 8"></circle>
            <circle className="ring ring--3" cx="60" cy="60" r="8" fill="var(--color-amber)"></circle>
          </svg>
          {shots > 0 && <span key={'b' + shots} className="xp-goalball" aria-hidden="true"></span>}
        </button>
        <h2><span className="accent">Raak.</span></h2>
        <p className="xp-finale__sub">
          <span className="xp-lead-swap" key={audience}>{XFINALE_SUBS[audience] || XFINALE_SUBS.onderneming}</span>
        </p>
        <div className="xp-finale__ctas">
          <XMagnetic>
            <Button variant="primary" size="lg" onClick={() => { window.location.href = mailHref; }}>Trap af →</Button>
          </XMagnetic>
          <Button variant="on-dark" size="lg" onClick={copyEmail}>Kopieer e-mailadres</Button>
        </div>
        <p className="xp-finale__email"><a href={mailHref}>{email}</a></p>
      </div>
      <div className={`sp-toast-holder ${toastVisible ? 'is-visible' : ''}`} aria-live="polite">
        <Toast variant="highlight" title="Gekopieerd" message={`${email} staat op je klembord.`} />
      </div>
    </section>
  );
}
