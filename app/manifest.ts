import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Setpiece",
    short_name: "Setpiece",
    description: "Strategie en digitale identiteit voor ondernemingen en verenigingen.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2ec",
    theme_color: "#0f2a52",
    lang: "nl-NL",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
