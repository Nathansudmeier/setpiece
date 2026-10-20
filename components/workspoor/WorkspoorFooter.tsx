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
                "AI Consultancy voor werk dat eenvoudiger, sneller en consistenter kan. Met een kansenscan voor procesverbetering en teamtraining voor verantwoord AI-gebruik."}
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
            <Link href={copy.footer_link_005 ?? "/kansenscan"}>
              {copy.footer_tekst_006 ?? "Kansenscan"}
            </Link>
            <Link href={copy.footer_link_007 ?? "/ai-implementatie"}>
              {copy.footer_tekst_008 ?? "AI-implementatie"}
            </Link>
            <Link href={copy.footer_link_009 ?? "/ai-groeipartner"}>
              {copy.footer_tekst_010 ?? "AI-groeipartner"}
            </Link>
            <Link href={copy.footer_link_011 ?? "/ai-maatwerk"}>
              {copy.footer_tekst_012 ?? "Maatwerkverkenning"}
            </Link>
            <Link href={copy.footer_link_013 ?? "/werkwijze"}>
              {copy.footer_tekst_014 ?? "Werkwijze"}
            </Link>
            <Link href="/privacy">{copy.footer_tekst_015 ?? "Privacy"}</Link>
            <Link href="/cookies">{copy.footer_tekst_016 ?? "Cookies"}</Link>
          </nav>
          <div className="ws-footer__contact">
            <span>{copy.footer_tekst_017 ?? "Setpiece · Almere"}</span>
            <a href={copy.footer_link_018 ?? "mailto:hallo@setpiece.nl"}>
              {copy.footer_tekst_019 ?? "hallo@setpiece.nl"}
            </a>
            <a
              href={
                copy.footer_link_020 ??
                "https://www.linkedin.com/company/setpiece-nl/"
              }
            >
              {copy.footer_tekst_021 ?? "LinkedIn"}
            </a>
          </div>
        </div>
        <div className="ws-footer__bottom">
          <span>{copy.footer_tekst_022 ?? "© 2026 Setpiece"}</span>
          <span>{copy.footer_tekst_023 ?? "KVK 99116111"}</span>
          <span>
            {copy.footer_tekst_024 ??
              "Gegevens uit een aanvraag worden alleen gebruikt om die aanvraag te beoordelen."}
          </span>
        </div>
      </div>
    </footer>
  );
}
