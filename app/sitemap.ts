import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

const ROUTES = [
  "",
  "/over",
  "/experience",
  "/nankaro",
  "/cases/mv-artemis",
  "/cases/set-in",
  "/cases/merkstrategie",
  "/cases/digitale-identiteit",
  "/cases/ai-strategie",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route, index) => ({
    url: new URL(route || "/", SITE_URL).toString(),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/over" ? 0.8 : 0.7,
  }));
}
