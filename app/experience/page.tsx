import ExperiencePage from "@/components/experience/ExperiencePage";
import { createPageMetadata } from "@/lib/seo";
import "../styles/experience.css";
import "../styles/glass.css";

export const metadata = createPageMetadata({
  title: "De Setpiece-beleving",
  description: "Elke kans voorbereid. Elke campagne raak. Een interactieve kennismaking met Setpiece.",
  path: "/experience",
});

export default function Page() {
  return <ExperiencePage />;
}
