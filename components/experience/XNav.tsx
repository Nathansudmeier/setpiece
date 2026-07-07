"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ds";

const XNAV_LINKS = [
  { id: "spelplan", label: "Spelplan" },
  { id: "werkwijze", label: "Werkwijze" },
  { id: "bewijs", label: "Bewijs" },
  { id: "contact", label: "Contact" },
];

export default function XNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = XNAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (s): s is HTMLElement => Boolean(s)
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    document.body.style.overflow = "";
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };

  const mailHref = "mailto:hello@setpiece.nl?subject=" + encodeURIComponent("Nieuw project via setpiece.nl");

  return (
    <header className={`xp-nav ${scrolled || open ? "is-scrolled" : ""}`}>
      <div className="xp-nav__inner">
        <Link href="/" className="xp-nav__logo" aria-label="Setpiece — home">
          <img src="/logos/setpiece-logo-wit.png" alt="Setpiece" />
        </Link>
        <div className="xp-nav__actions">
          <Button variant="primary" size="sm" onClick={() => { window.location.href = mailHref; }}>
            Trap af →
          </Button>
          <button
            type="button"
            className="gl-menubtn gl-menubtn--dark"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <line x1="1" y1="1.5" x2="15" y2="1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
              <line className="l2" x1="1" y1="8.5" x2="10" y2="8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
            </svg>
            Menu
          </button>
        </div>
      </div>
      <div className="xp-nav__progress" ref={progressRef} aria-hidden="true"></div>
      {open && mounted && createPortal(
        <div className="gl-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="gl-menu__bg" aria-hidden="true">
            <span className="gl-menu__blob gl-menu__blob--1"></span>
            <span className="gl-menu__blob gl-menu__blob--2"></span>
            <span className="gl-menu__blob gl-menu__blob--3"></span>
            <svg className="gl-menu__ring" width="260" height="260" viewBox="0 0 260 260">
              <circle cx="130" cy="130" r="120" fill="none" stroke="var(--color-perkament)" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 8"></circle>
              <circle cx="130" cy="130" r="70" fill="none" stroke="var(--color-perkament)" strokeOpacity="0.14" strokeWidth="1.5"></circle>
            </svg>
          </div>
          <div className="gl-menu__top">
            <img src="/logos/setpiece-logo-wit.png" alt="Setpiece" />
            <button type="button" className="gl-menu__close" aria-label="Sluit menu" onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <line x1="1.5" y1="1.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="12.5" y1="1.5" x2="1.5" y2="12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
              </svg>
            </button>
          </div>
          <nav className="gl-menu__links" aria-label="Menu">
            {XNAV_LINKS.map((l, i) => (
              <a
                key={l.id}
                href={"#" + l.id}
                className={activeId === l.id ? "is-active" : ""}
                style={{ "--i": i } as React.CSSProperties}
                onClick={(e) => go(e, l.id)}
              >
                <span className="gl-menu__num">{"0" + (i + 1)}</span>
                <span className="gl-menu__word">{l.label}</span>
              </a>
            ))}
            <Link href="/over" style={{ "--i": XNAV_LINKS.length } as React.CSSProperties}>
              <span className="gl-menu__num">{"0" + (XNAV_LINKS.length + 1)}</span>
              <span className="gl-menu__word">Over</span>
            </Link>
          </nav>
          <div className="gl-menu__foot">
            <span className="gl-menu__dot" aria-hidden="true"></span>
            <span>Beschikbaar voor nieuwe projecten</span>
            <a href={mailHref}>hello@setpiece.nl</a>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
