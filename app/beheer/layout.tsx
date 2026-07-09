import type { Metadata } from "next";

import "../styles/beheer.css";

// Het beheergedeelte is privé: niet indexeren, niet volgen.
export const metadata: Metadata = {
  title: {
    default: "Setpiece Beheer",
    template: "%s · Setpiece Beheer",
  },
  robots: { index: false, follow: false },
};

export default function BeheerRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
