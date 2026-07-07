import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

import "./styles/tokens.css";
import "./styles/ds.css";
import "./styles/site.css";
import "./styles/experience.css";
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
  title: "Setpiece — Strategie & digitale identiteit",
  description:
    "Strategie en digitale identiteit voor ondernemingen en verenigingen. Elke kans voorbereid, elke campagne raak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
