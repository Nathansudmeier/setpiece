import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Setpiece",
    short_name: "Setpiece",
    description: "AI Consultancy voor beter dagelijks werk.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9fb",
    theme_color: "#17141f",
    lang: "nl-NL",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
