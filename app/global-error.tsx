"use client";

export default function GlobalError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <html lang="nl">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#17141f", color: "#faf9fb", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 48, marginBottom: 16 }}>De pagina kon niet worden geladen.</h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#cbc7d1" }}>Probeer het opnieuw of mail naar hallo@setpiece.nl.</p>
            <button type="button" onClick={unstable_retry} style={{ marginTop: 20, minHeight: 52, padding: "12px 24px", border: 0, borderRadius: 2, background: "#e8558a", color: "#17141f", fontWeight: 700, cursor: "pointer" }}>
              Probeer opnieuw
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
