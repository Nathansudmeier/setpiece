import { createPageMetadata, DEFAULT_DESCRIPTION } from "@/lib/seo";
import HomePage from "@/components/site/HomePage";

const homeMetadata = createPageMetadata({
  title: "Strategie & digitale identiteit",
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export const metadata = {
  ...homeMetadata,
  title: { absolute: "Setpiece — Strategie & digitale identiteit" },
};

export default function Home() {
  return <HomePage />;
}
