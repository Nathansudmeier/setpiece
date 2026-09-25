import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

const ROUTES = [
  "",
  "/diensten",
  "/kansenscan",
  "/ai-implementatie",
  "/ai-groeipartner",
  "/ai-maatwerk",
  "/ai-geletterdheid",
  "/kennis",
  "/kennis/bedrijfsprocessen-automatiseren",
  "/kennis/ai-resultaat-meten",
  "/kennis/ai-werkafspraken",
  "/kennis/ai-geletterdheid-verplicht",
  "/werkwijze",
  "/praktijkvoorbeelden",
  "/over",
  "/contact",
  "/privacy",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route, index) => ({
    url: new URL(route || "/", SITE_URL).toString(),
    ...(!["/privacy", "/cookies"].includes(route) ? { lastModified: "2026-09-25" } : {}),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/kansenscan" ? 0.9 : 0.7,
  }));
}
