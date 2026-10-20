"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      appearance: "interaction-only";
      size: "flexible";
      theme: "auto";
      retry: "never";
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      "timeout-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileProps = {
  action: "contact" | "intake";
  onToken: (token: string) => void;
  resetKey: number;
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const VERIFICATION_REQUIRED_MESSAGE = "Rond eerst de beveiligingscontrole af. Je invoer blijft bewaard.";
type VerificationState = "loading" | "checking" | "verified" | "error" | "expired" | "unavailable";

export default function Turnstile({ action, onToken, resetKey }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const previousResetRef = useRef(resetKey);
  const [nearViewport, setNearViewport] = useState(false);
  const [state, setState] = useState<VerificationState>("loading");

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "600px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const renderWidget = useCallback(() => {
    if (!SITE_KEY || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

    const clearToken = (nextState: VerificationState) => {
      onTokenRef.current("");
      setState(nextState);
    };

    try {
      setState("checking");
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        action,
        appearance: "interaction-only",
        size: "flexible",
        theme: "auto",
        retry: "never",
        callback: (token) => {
          onTokenRef.current(token);
          setState("verified");
        },
        "error-callback": () => clearToken("error"),
        "expired-callback": () => clearToken("expired"),
        "timeout-callback": () => clearToken("error"),
      });
    } catch {
      clearToken("unavailable");
    }
  }, [action]);

  const retry = useCallback(() => {
    onTokenRef.current("");
    setState("checking");
    const widgetId = widgetIdRef.current;
    if (widgetId && window.turnstile) {
      try {
        window.turnstile.reset(widgetId);
      } catch {
        setState("unavailable");
      }
    } else {
      renderWidget();
    }
  }, [renderWidget]);

  useEffect(() => {
    if (previousResetRef.current === resetKey) return;
    previousResetRef.current = resetKey;
    retry();
  }, [resetKey, retry]);

  useEffect(() => {
    if (!nearViewport || state !== "loading") return;
    // Only bound script loading; a person may need longer to complete a challenge.
    const timer = window.setTimeout(() => {
      onTokenRef.current("");
      setState("unavailable");
    }, 30_000);
    return () => window.clearTimeout(timer);
  }, [nearViewport, state]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, []);

  return (
    <div className="sp-turnstile" role="group" aria-label="Beveiligingscontrole">
      <div ref={containerRef} />
      {(!SITE_KEY || state === "unavailable") ? (
        <div className="sp-turnstile__error" role="alert">
          <p>De beveiligingscontrole kon niet laden. Je invoer blijft bewaard.</p>
          <p>Controleer je verbinding of <a href="mailto:hallo@setpiece.nl">mail naar hallo@setpiece.nl</a>.</p>
        </div>
      ) : state === "error" || state === "expired" ? (
        <div className="sp-turnstile__error" role="alert">
          <p>{state === "expired" ? "De beveiligingscontrole is verlopen." : "De beveiligingscontrole is niet gelukt."} Je invoer blijft bewaard.</p>
          <button type="button" className="sp-turnstile__retry" onClick={retry}>
            Controle opnieuw proberen
          </button>
          <p>Blijft het misgaan? <a href="mailto:hallo@setpiece.nl">Mail naar hallo@setpiece.nl</a>.</p>
        </div>
      ) : (
        <>
          <p className="sp-turnstile__status" role="status">
            {state === "verified" ? "Beveiligingscontrole afgerond." : state === "loading" ? "Beveiligingscontrole wordt geladen…" : "Beveiligingscontrole wordt uitgevoerd…"}
          </p>
          {state === "checking" ? (
            <div className="sp-turnstile__help">
              <p>Duurt de controle lang?</p>
              <button type="button" className="sp-turnstile__retry" onClick={retry}>
                Controle opnieuw proberen
              </button>
              <a href="mailto:hallo@setpiece.nl">Mail naar hallo@setpiece.nl</a>
            </div>
          ) : null}
        </>
      )}
      {nearViewport && SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderWidget}
          onError={() => {
            onTokenRef.current("");
            setState("unavailable");
          }}
        />
      ) : null}
    </div>
  );
}
