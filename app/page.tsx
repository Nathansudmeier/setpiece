import WorkspoorHome from "@/components/workspoor/WorkspoorHome";
import { createPageMetadata, DEFAULT_DESCRIPTION } from "@/lib/seo";

const homeMetadata = createPageMetadata({
  title: "AI Consultancy voor beter dagelijks werk",
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export const metadata = {
  ...homeMetadata,
  title: { absolute: "Setpiece | AI Consultancy voor beter dagelijks werk" },
};

export default function Home() {
  return <WorkspoorHome />;
}
