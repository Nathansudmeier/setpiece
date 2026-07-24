"use client";

import { useEffect } from "react";

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
    <main id="main-content" className="ws-error-page">
      <div>
        <p className="ws-context">Er ging iets mis</p>
        <h1>Het werkspoor stokte even.</h1>
        <p>Probeer de pagina opnieuw. Blijft dit gebeuren, mail dan naar hallo@setpiece.nl.</p>
        <button className="ws-button" type="button" onClick={unstable_retry}>
          Probeer opnieuw
        </button>
      </div>
    </main>
  );
}
