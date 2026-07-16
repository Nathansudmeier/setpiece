"use client";

export default function GlobalError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <html lang="nl">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#0f2a52", color: "#f5f2ec", textAlign: "center", fontFamily: "sans-serif" }}>
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 48, marginBottom: 16 }}>De pagina kon niet worden geladen.</h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.78 }}>Probeer het opnieuw of mail naar hallo@setpiece.nl.</p>
            <button type="button" onClick={unstable_retry} style={{ marginTop: 20, minHeight: 48, padding: "12px 20px", border: 0, borderRadius: 10, background: "#e8a020", color: "#0f2a52", fontWeight: 700, cursor: "pointer" }}>
              Probeer opnieuw
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
