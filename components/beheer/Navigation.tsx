"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  ["/beheer", "Vandaag"],
  ["/beheer/projecten", "Projecten"],
  ["/beheer/acties", "Acties"],
  ["/beheer/personen", "Personen"],
  ["/beheer/aanvragen", "Aanvragen"],
  ["/beheer/beslissingen", "Beslissingen"],
  ["/beheer/activiteit", "Activiteit"],
  ["/beheer/website", "Website"],
];
export default function Navigation() {
  const path = usePathname();
  return (
    <nav className="bw-nav" aria-label="Werkomgeving">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            (href === "/beheer" ? path === href : path.startsWith(href))
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
