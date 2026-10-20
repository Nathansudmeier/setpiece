import Image from "next/image";
import Link from "next/link";

import { WORKSPOOR_NAV } from "@/lib/workspoor-content";

type WorkspoorHeaderProps = {
  activePath?: string;
  dark?: boolean;
  navItems?: readonly { href: string; label: string }[];
  ctaLabel?: string;
  ctaHref?: string;
};

export default function WorkspoorHeader({
  activePath,
  dark = false,
  navItems = WORKSPOOR_NAV,
  ctaLabel = "Bespreek de kansenscan",
  ctaHref = "/contact",
}: WorkspoorHeaderProps) {
  const logo = dark
    ? "/logos/workspoor/setpiece-logo-paper.svg"
    : "/logos/workspoor/setpiece-logo-ink.svg";

  return (
    <>
      <a className="ws-skip-link" href="#main-content">
        Ga naar de inhoud
      </a>
      <header className={`ws-header${dark ? " ws-header--dark" : ""}`}>
        <div className="ws-frame ws-header__inner">
          <Link
            href="/"
            className="ws-header__brand"
            aria-label="Setpiece, naar de homepage"
          >
            <Image src={logo} alt="Setpiece" width={164} height={40} priority />
          </Link>

          <nav className="ws-header__nav" aria-label="Hoofdnavigatie">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activePath === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link className="ws-button ws-button--small" href={ctaHref}>
            {ctaLabel}
          </Link>

          <details className="ws-menu">
            <summary>Menu</summary>
            <nav aria-label="Mobiele navigatie">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={activePath === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={ctaHref}
                aria-current={activePath === "/contact" ? "page" : undefined}
              >
                {ctaLabel}
              </Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
