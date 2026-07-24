import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import JsonLd from "@/components/JsonLd";
import RouteFocus from "@/components/workspoor/RouteFocus";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

import "./styles/tokens.css";
import "./styles/ds.css";
import "./styles/site.css";
import "./styles/glass.css";
import "./styles/workspoor.css";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: {
    default: "Setpiece | AI Consultancy voor beter dagelijks werk",
    template: "%s | Setpiece",
  },
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: "Nathan Sudmeier", url: "/over" }],
  creator: "Setpiece",
  publisher: "Setpiece",
  keywords: [
    "AI Consultancy",
    "AI consultant",
    "AI-oplossingen",
    "AI-workflows",
    "workflowautomatisering",
    "procesverbetering",
    "kansenscan",
    "mkb",
    "Almere",
  ],
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: SITE_NAME,
    title: "Setpiece | AI Consultancy voor beter dagelijks werk",
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Setpiece | AI Consultancy voor beter dagelijks werk",
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={spaceGrotesk.variable}>
      <body>
        <RouteFocus />
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
                description: DEFAULT_DESCRIPTION,
                slogan: "Maak dagelijks werk eenvoudiger en beter.",
                serviceType: "AI Consultancy en implementatie van AI-workflows",
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
