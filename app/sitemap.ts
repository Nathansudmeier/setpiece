import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

const ROUTES = [
  "",
  "/kansenscan",
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
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/kansenscan" ? 0.9 : 0.7,
  }));
}
