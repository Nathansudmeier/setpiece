import Image from "next/image";
import Link from "next/link";

import { WORKSPOOR_NAV } from "@/lib/workspoor-content";

type WorkspoorHeaderProps = {
  activePath?: string;
  dark?: boolean;
};

export default function WorkspoorHeader({
  activePath,
  dark = false,
}: WorkspoorHeaderProps) {
  const logo = dark
    ? "/logos/workspoor/setpiece-logo-paper.svg"
    : "/logos/workspoor/setpiece-logo-ink.svg";
  const isLiteracy = activePath === "/ai-geletterdheid";
  const isService = ["/ai-implementatie", "/ai-groeipartner", "/ai-maatwerk"].includes(activePath ?? "");
  const contactHref = isLiteracy ? "/ai-geletterdheid/aanvragen" : isService ? `/contact?dienst=${activePath?.slice(1)}` : "/contact";
  const contactLabel = isLiteracy ? "Bespreek de training" : isService ? "Bespreek je vraag" : "Bespreek de kansenscan";
  const navPath = isService || activePath === "/kansenscan" ? "/diensten" : activePath?.startsWith("/kennis/") ? "/kennis" : activePath;

  return (
    <>
      <a className="ws-skip-link" href="#main-content">
        Ga naar de inhoud
      </a>
      <header className={`ws-header${dark ? " ws-header--dark" : ""}`}>
        <div className="ws-frame ws-header__inner">
          <Link href="/" className="ws-header__brand" aria-label="Setpiece, naar de homepage">
            <Image src={logo} alt="Setpiece" width={164} height={40} priority />
          </Link>

          <nav className="ws-header__nav" aria-label="Hoofdnavigatie">
            {WORKSPOOR_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={navPath === item.href ? (activePath === item.href ? "page" : "true") : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link className="ws-button ws-button--small" href={contactHref}>
            {contactLabel}
          </Link>

          <details className="ws-menu">
            <summary>Menu</summary>
            <nav aria-label="Mobiele navigatie">
              {WORKSPOOR_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={navPath === item.href ? (activePath === item.href ? "page" : "true") : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <Link href={contactHref} aria-current={activePath === "/contact" ? "page" : undefined}>
                {contactLabel}
              </Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
