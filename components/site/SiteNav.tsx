"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ds";

const SITENAV_LINKS = [
  { id: "diensten", label: "Diensten" },
  { id: "werkwijze", label: "Werkwijze" },
  { id: "cases", label: "Cases" },
  { id: "contact", label: "Contact" },
];

const PAGE_LINKS = [
  { href: "/nankaro", label: "Nankaro" },
  { href: "/over", label: "Over" },
];

type SiteNavProps = {
  mode?: "home" | "page";
  onNavigate?: (id: string) => void;
};

export default function SiteNav({ mode = "page", onNavigate }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
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
    if (mode !== "home" || !("IntersectionObserver" in window)) return;
    const sections = SITENAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (s): s is HTMLElement => Boolean(s)
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [mode]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const mailHref =
    "mailto:hallo@setpiece.nl?subject=" + encodeURIComponent("Kennismaking via setpiece.nl");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (mode === "home") {
      e.preventDefault();
      onNavigate?.(id);
    }
  };

  return (
    <header className="sp-nav">
      <div className="sp-nav__inner">
        <Link href="/" className="sp-nav__logo" aria-label="Setpiece — home">
          <img src="/logos/setpiece-logo-horizontaal.svg" alt="Setpiece" />
        </Link>
        <div className="sp-nav__actions">
          {mode === "home" ? (
            <Button variant="primary" size="sm" onClick={() => onNavigate?.("contact")}>
              Plan een kennismaking
            </Button>
          ) : (
            <Button variant="primary" size="sm" href="/#contact">
              Plan een kennismaking
            </Button>
          )}
          <button
            type="button"
            className="gl-menubtn gl-menubtn--light"
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
      <div className="sp-nav__progress" ref={progressRef} aria-hidden="true"></div>
      {open &&
        createPortal(
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
              {SITENAV_LINKS.map((l, i) =>
                mode === "home" ? (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    className={activeId === l.id ? "is-active" : ""}
                    style={{ "--i": i } as React.CSSProperties}
                    onClick={(e) => handleClick(e, l.id)}
                  >
                    <span className="gl-menu__num">{"0" + (i + 1)}</span>
                    <span className="gl-menu__word">{l.label}</span>
                  </a>
                ) : (
                  <Link
                    key={l.id}
                    href={`/#${l.id}`}
                    className={activeId === l.id ? "is-active" : ""}
                    style={{ "--i": i } as React.CSSProperties}
                    onClick={(e) => handleClick(e, l.id)}
                  >
                    <span className="gl-menu__num">{"0" + (i + 1)}</span>
                    <span className="gl-menu__word">{l.label}</span>
                  </Link>
                )
              )}
              {PAGE_LINKS.map((l, j) => {
                const idx = SITENAV_LINKS.length + j;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{ "--i": idx } as React.CSSProperties}
                    onClick={() => setOpen(false)}
                  >
                    <span className="gl-menu__num">{"0" + (idx + 1)}</span>
                    <span className="gl-menu__word">{l.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="gl-menu__foot">
              <span className="gl-menu__dot" aria-hidden="true"></span>
              <span>Beschikbaar voor nieuwe projecten</span>
              <a href={mailHref}>hallo@setpiece.nl</a>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
