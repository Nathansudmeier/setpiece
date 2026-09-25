import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import JsonLd from "@/components/JsonLd";
import RouteFocus from "@/components/workspoor/RouteFocus";
import { DEFAULT_DESCRIPTION, ORGANIZATION_ID, PERSON_ID, SITE_NAME, SITE_URL, WEBSITE_ID } from "@/lib/seo";

import "./styles/tokens.css";
import "./styles/ds.css";
import "./styles/site.css";
import "./styles/workspoor.css";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-VariableFont_wght.woff2",
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
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                name: "Setpiece",
                url: SITE_URL.toString(),
                email: "hallo@setpiece.nl",
                logo: {
                  "@type": "ImageObject",
                  url: new URL("/apple-icon", SITE_URL).toString(),
                  width: 180,
                  height: 180,
                },
                address: { "@type": "PostalAddress", addressLocality: "Almere", addressCountry: "NL" },
                areaServed: "Nederland",
                description: DEFAULT_DESCRIPTION,
                slogan: "Maak dagelijks werk eenvoudiger en beter.",
                founder: { "@id": PERSON_ID },
                identifier: { "@type": "PropertyValue", propertyID: "KVK", value: "99116111" },
                sameAs: ["https://www.linkedin.com/company/setpiece-nl/"],
              },
              {
                "@type": "Person",
                "@id": PERSON_ID,
                name: "Nathan Sudmeier",
                url: new URL("/over", SITE_URL).toString(),
                jobTitle: "AI-consultant en implementatiepartner",
                worksFor: { "@id": ORGANIZATION_ID },
              },
              {
                "@type": "WebSite",
                "@id": WEBSITE_ID,
                url: SITE_URL.toString(),
                name: "Setpiece",
                inLanguage: "nl-NL",
                publisher: { "@id": ORGANIZATION_ID },
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
