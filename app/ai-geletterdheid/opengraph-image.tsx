import { ImageResponse } from "next/og";

export const alt = "AI-geletterdheid voor dagelijks werk | Setpiece";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function LiteracyOpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#17141f", color: "#faf9fb", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>Setpiece / AI-geletterdheid</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-2px" }}><span>Je team gebruikt AI.</span><span style={{ color: "#e8558a" }}>Met kennis en</span><span style={{ color: "#e8558a" }}>duidelijke afspraken.</span></div>
      <div style={{ fontSize: 25, color: "#cbc7d1" }}>Teamtraining · Werkafspraken · Opvolging na 30 dagen</div>
    </div>, size,
  );
}
