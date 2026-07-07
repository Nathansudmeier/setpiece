import type { Metadata } from "next";
import ExperiencePage from "@/components/experience/ExperiencePage";

export const metadata: Metadata = {
  title: "Setpiece — De beleving",
  description: "Elke kans voorbereid. Elke campagne raak. Een interactieve kennismaking met Setpiece.",
};

export default function Page() {
  return <ExperiencePage />;
}
