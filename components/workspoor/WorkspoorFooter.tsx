import Image from "next/image";
import Link from "next/link";

import { WORKSPOOR_NAV } from "@/lib/workspoor-content";

export default function WorkspoorFooter() {
  return (
    <footer className="ws-footer">
      <div className="ws-frame">
        <div className="ws-footer__top">
          <div>
            <Image
              src="/logos/workspoor/setpiece-logo-paper.svg"
              alt="Setpiece"
              width={164}
              height={40}
            />
            <p>
              AI Consultancy voor werk dat eenvoudiger, sneller en consistenter kan.
              De kansenscan is de vaste eerste stap.
            </p>
          </div>
          <nav aria-label="Voettekstnavigatie">
            {WORKSPOOR_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="ws-footer__contact">
            <span>Setpiece · Almere</span>
            <a href="mailto:hallo@setpiece.nl">hallo@setpiece.nl</a>
            <a href="https://www.linkedin.com/company/setpiece-nl/">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="ws-footer__bottom">
          <span>© 2026 Setpiece</span>
          <span>KVK 99116111</span>
          <span>Gegevens uit een aanvraag worden alleen gebruikt om die aanvraag te beoordelen.</span>
        </div>
      </div>
    </footer>
  );
}
