import { ImageResponse } from "next/og";

export const alt = "Setpiece — Elke kans voorbereid. Elke campagne raak.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "#0f2a52",
        color: "#f5f2ec",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "22px", fontSize: 38, fontWeight: 700 }}>
        <div style={{ width: 54, height: 54, borderRadius: 999, background: "#e8a020" }} />
        Setpiece
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-3px" }}>
        <span>Elke kans voorbereid.</span>
        <span style={{ color: "#e8a020" }}>Elke campagne raak.</span>
      </div>
      <div style={{ fontSize: 24, color: "rgba(245,242,236,0.72)" }}>
        Strategie & digitale identiteit
      </div>
    </div>,
    size,
  );
}
