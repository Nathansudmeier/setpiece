import type { Metadata } from "next";

import OverPage from "@/components/site/OverPage";

export const metadata: Metadata = {
  title: "Over Setpiece — Strategie & digitale identiteit",
  description: "Waarom Setpiece heet zoals het heet, en hoe we werken.",
};

export default function Page() {
  return <OverPage />;
}
