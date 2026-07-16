"use client";

import { useEffect } from "react";

import { Button } from "@/components/ds";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="sp-error-page">
      <div className="sp-error-page__inner">
        <p className="sp-eyebrow sp-eyebrow--on-dark">Er ging iets mis</p>
        <h1>De voorbereiding stokte even.</h1>
        <p>Probeer de pagina opnieuw. Blijft dit gebeuren, mail dan naar hallo@setpiece.nl.</p>
        <Button size="lg" onClick={unstable_retry}>Probeer opnieuw</Button>
      </div>
    </main>
  );
}
