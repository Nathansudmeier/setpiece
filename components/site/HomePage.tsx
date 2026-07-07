"use client";

import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHero from "@/components/site/SiteHero";
import SiteServices from "@/components/site/SiteServices";
import SiteProcess from "@/components/site/SiteProcess";
import SiteCases from "@/components/site/SiteCases";
import SiteTestimonial from "@/components/site/SiteTestimonial";
import SiteContact from "@/components/site/SiteContact";

export default function HomePage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  return (
    <div data-screen-label="Homepage">
      <SiteNav mode="home" onNavigate={scrollTo} />
      <SiteHero onNavigate={scrollTo} />
      <SiteServices />
      <SiteProcess />
      <SiteCases />
      <SiteTestimonial />
      <SiteContact />
      <SiteFooter mode="home" />
    </div>
  );
}
