import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import JsonLd from "@/components/JsonLd";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

import "./styles/tokens.css";
import "./styles/ds.css";
import "./styles/site.css";
import "./styles/glass.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: {
    default: "Setpiece — Strategie & digitale identiteit",
    template: "%s | Setpiece",
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: "Nathan Sudmeier", url: "/over" }],
  creator: "Setpiece",
  publisher: "Setpiece",
  keywords: ["merkstrategie", "digitale identiteit", "AI-strategie", "campagnes", "Almere"],
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: SITE_NAME,
    title: "Setpiece — Strategie & digitale identiteit",
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Setpiece — Strategie & digitale identiteit",
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ProfessionalService",
                "@id": `${SITE_URL}#organization`,
                name: "Setpiece",
                url: SITE_URL.toString(),
                email: "hallo@setpiece.nl",
                address: { "@type": "PostalAddress", addressLocality: "Almere", addressCountry: "NL" },
                areaServed: "Nederland",
                sameAs: ["https://www.linkedin.com/company/setpiece-nl/"],
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}#website`,
                url: SITE_URL.toString(),
                name: "Setpiece",
                inLanguage: "nl-NL",
                publisher: { "@id": `${SITE_URL}#organization` },
              },
            ],
          }}
        />
        {process.env.VERCEL ? <Analytics /> : null}
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
