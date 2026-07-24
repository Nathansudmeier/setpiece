import { ImageResponse } from "next/og";

export const alt = "Setpiece | AI Consultancy voor beter dagelijks werk.";
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
        background: "#17141f",
        color: "#faf9fb",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "22px", fontSize: 38, fontWeight: 700 }}>
        <div
          style={{
            width: 54,
            height: 54,
            background: "#e8558a",
            clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
          }}
        />
        Setpiece
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-3px" }}>
        <span>AI Consultancy voor</span>
        <span style={{ color: "#e8558a" }}>beter dagelijks werk.</span>
      </div>
      <div style={{ fontSize: 24, color: "#cbc7d1" }}>
        Kansenscan · € 1.250 excl. btw · 5 werkdagen
      </div>
    </div>,
    size,
  );
}
