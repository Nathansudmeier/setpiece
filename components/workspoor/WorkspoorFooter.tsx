import Image from "next/image";
import Link from "next/link";
import type { CmsCopy } from "@/lib/cms/schema";
import { sharedContent } from "@/lib/cms/shared";
export default function WorkspoorFooter({ copy }: { copy: CmsCopy }) {
  const { WORKSPOOR_NAV } = sharedContent(copy);

  return (
    <footer className="ws-footer">
      <div className="ws-frame">
        <div className="ws-footer__top">
          <div>
            <Image
              src="/logos/workspoor/setpiece-logo-paper.svg"
              alt={copy.footer_tekst_001 ?? "Setpiece"}
              width={164}
              height={40}
            />
            <p>
              {copy.footer_tekst_002 ??
                "AI Consultancy voor werk dat eenvoudiger, sneller en consistenter kan. De kansenscan is de vaste eerste stap."}
            </p>
          </div>
          <nav aria-label="Voettekstnavigatie">
            {WORKSPOOR_NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href={copy.footer_link_003 ?? "/contact"}>
              {copy.footer_tekst_004 ?? "Contact"}
            </Link>
            <Link href="/privacy">{copy.footer_tekst_005 ?? "Privacy"}</Link>
            <Link href="/cookies">{copy.footer_tekst_006 ?? "Cookies"}</Link>
          </nav>
          <div className="ws-footer__contact">
            <span>{copy.footer_tekst_007 ?? "Setpiece · Almere"}</span>
            <a href={copy.footer_link_008 ?? "mailto:hallo@setpiece.nl"}>
              {copy.footer_tekst_009 ?? "hallo@setpiece.nl"}
            </a>
            <a
              href={
                copy.footer_link_010 ??
                "https://www.linkedin.com/company/setpiece-nl/"
              }
            >
              {copy.footer_tekst_011 ?? "LinkedIn"}
            </a>
          </div>
        </div>
        <div className="ws-footer__bottom">
          <span>{copy.footer_tekst_012 ?? "© 2026 Setpiece"}</span>
          <span>{copy.footer_tekst_013 ?? "KVK 99116111"}</span>
          <span>
            {copy.footer_tekst_014 ??
              "Gegevens uit een aanvraag worden alleen gebruikt om die aanvraag te beoordelen."}
          </span>
        </div>
      </div>
    </footer>
  );
}
