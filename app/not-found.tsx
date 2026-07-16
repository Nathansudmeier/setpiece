import { Button } from "@/components/ds";
import SiteFooter from "@/components/site/SiteFooter";
import SiteNav from "@/components/site/SiteNav";

export default function NotFound() {
  return (
    <div>
      <SiteNav mode="page" />
      <main id="main-content" className="sp-error-page">
        <div className="sp-error-page__inner">
          <p className="sp-eyebrow sp-eyebrow--on-dark">404</p>
          <h1>Deze kans ligt niet op het veld.</h1>
          <p>De pagina bestaat niet meer of het adres klopt niet. Ga terug naar het spelplan.</p>
          <Button href="/" size="lg">Naar de homepage</Button>
        </div>
      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
