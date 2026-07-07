"use client";

import Link from "next/link";

type SiteFooterProps = {
  mode?: "home" | "page";
};

type FooterLink = { id?: string; href?: string; label: string };

export default function SiteFooter({ mode = "page" }: SiteFooterProps) {
  const links: FooterLink[] = [
    { id: "diensten", label: "Diensten" },
    { id: "werkwijze", label: "Werkwijze" },
    { id: "cases", label: "Cases" },
    { href: "/nankaro", label: "Nankaro" },
    { href: "/over", label: "Over" },
  ];
  return (
    <footer className="sp-footer">
      <div className="sp-container">
        <div className="sp-footer__top">
          <div>
            <img src="/logos/setpiece-logo-wit.png" alt="Setpiece" style={{ height: 24, marginBottom: 12 }} />
            <p className="sp-footer__desc">Strategie &amp; digitale identiteit voor ondernemingen en verenigingen.</p>
          </div>
          <nav className="sp-footer__links">
            {links.map((l) =>
              !l.href && mode === "home" ? (
                <a key={l.label} href={`#${l.id}`}>{l.label}</a>
              ) : (
                <Link key={l.label} href={l.href || `/#${l.id}`}>{l.label}</Link>
              )
            )}
          </nav>
          <a
            href="https://www.linkedin.com/company/setpiece-nl/"
            aria-label="Setpiece op LinkedIn"
            className="sp-footer__social"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9z" />
            </svg>
          </a>
        </div>
        <div className="sp-footer__bottom">
          <span>© 2026 Setpiece — Almere, Nederland — KVK 99116111</span>
          <a href="mailto:hallo@setpiece.nl">hallo@setpiece.nl</a>
        </div>
      </div>
    </footer>
  );
}
