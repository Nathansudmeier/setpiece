import Link from "next/link";

type ClosingCtaProps = {
  title?: string;
  body?: string;
};

export default function ClosingCta({
  title = "Weet je dat werk beter kan, maar nog niet waar je begint?",
  body = "In maximaal 30 minuten verkennen we het werkprobleem, eigenaarschap en de voorwaarden. De volledige diagnose blijft onderdeel van de betaalde scan.",
}: ClosingCtaProps) {
  return (
    <section className="ws-closing" aria-labelledby="closing-title">
      <div className="ws-frame ws-closing__grid">
        <h2 id="closing-title">{title}</h2>
        <div>
          <p>{body}</p>
          <Link className="ws-button" href="/contact">
            Bespreek de kansenscan
          </Link>
        </div>
      </div>
    </section>
  );
}
