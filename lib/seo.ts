import type { Metadata } from "next";

export const SITE_URL = new URL("https://www.setpiece.nl");
export const SITE_NAME = "Setpiece";
export const DEFAULT_DESCRIPTION =
  "Strategie en digitale identiteit voor ondernemingen en verenigingen. Elke kans voorbereid, elke campagne raak.";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({ title, description, path }: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}
