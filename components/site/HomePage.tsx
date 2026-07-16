import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHero from "@/components/site/SiteHero";
import SiteServices from "@/components/site/SiteServices";
import SiteProcess from "@/components/site/SiteProcess";
import SiteCases from "@/components/site/SiteCases";
import SiteFounder from "@/components/site/SiteFounder";
import SiteIntake from "@/components/site/SiteIntake";
import SiteTestimonial from "@/components/site/SiteTestimonial";
import SiteContact from "@/components/site/SiteContact";

export default function HomePage() {
  return (
    <div data-screen-label="Homepage">
      <SiteNav mode="home" />
      <main id="main-content">
        <SiteHero />
        <SiteServices />
        <SiteProcess />
        <SiteCases />
        <SiteFounder />
        <SiteIntake />
        <SiteTestimonial />
        <SiteContact />
      </main>
      <SiteFooter mode="home" />
    </div>
  );
}
