import Link from "next/link";
import type { CmsCopy } from "@/lib/cms/schema";

type ClosingCtaProps = {
  sharedCopy?: CmsCopy;
  title?: string;
  body?: string;
  href?: string;
  label?: string;
};

export default function ClosingCta({
  sharedCopy,
  title = sharedCopy?.cta_title ??
    "Weet je dat werk beter kan, maar nog niet waar je begint?",
  body = sharedCopy?.cta_body ??
    "In maximaal 30 minuten verkennen we het werkprobleem, eigenaarschap en de voorwaarden. De volledige diagnose blijft onderdeel van de betaalde scan.",
  href = sharedCopy?.link_cta ?? "/contact",
  label = sharedCopy?.cta_label ?? "Bespreek de kansenscan",
}: ClosingCtaProps) {
  return (
    <section className="ws-closing" aria-labelledby="closing-title">
      <div className="ws-frame ws-closing__grid">
        <h2 id="closing-title">{title}</h2>
        <div>
          <p>{body}</p>
          <Link className="ws-button" href={href}>
            {label}
          </Link>
        </div>
      </div>
    </section>
  );
}
