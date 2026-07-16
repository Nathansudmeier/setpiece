import JsonLd from "@/components/JsonLd";
import OverPage from "@/components/site/OverPage";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Over Setpiece",
  description: "Waarom Setpiece heet zoals het heet, wie erachter zit en hoe we werken.",
  path: "/over",
});

export default function Page() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Nathan Sudmeier",
        url: new URL("/over", SITE_URL).toString(),
        jobTitle: "Strateeg en productontwikkelaar",
        worksFor: { "@id": `${SITE_URL}#organization` },
        address: { "@type": "PostalAddress", addressLocality: "Almere", addressCountry: "NL" },
      }} />
      <OverPage />
    </>
  );
}
