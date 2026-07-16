"use client";

import { useCallback, useEffect, useState } from "react";
import XNav from "@/components/experience/XNav";
import XHero from "@/components/experience/XHero";
import XPlan from "@/components/experience/XPlan";
import XPlay from "@/components/experience/XPlay";
import XCases from "@/components/experience/XCases";
import XFinale from "@/components/experience/XFinale";
import SiteFooter from "@/components/site/SiteFooter";

type Audience = "onderneming" | "vereniging";

export default function ExperiencePage() {
  const [audience, setAudience] = useState<Audience>("onderneming");

  useEffect(() => {
    let frame = 0;
    try {
      const stored = localStorage.getItem('sp-audience');
      if (stored === 'vereniging' || stored === 'onderneming') {
        frame = requestAnimationFrame(() => setAudience(stored));
      }
    } catch { /* geen opslag */ }
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#0f2a52';
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  const pickAudience = useCallback((a: Audience) => {
    setAudience(a);
    try { localStorage.setItem('sp-audience', a); } catch { /* geen opslag */ }
  }, []);

  return (
    <div data-screen-label="Setpiece Experience" style={{ background: '#0f2a52' }}>
      <XNav />
      <main id="main-content">
        <XHero audience={audience} onAudience={pickAudience} />
        <XPlan audience={audience} />
        <XPlay />
        <XCases audience={audience} />
        <XFinale audience={audience} />
      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
