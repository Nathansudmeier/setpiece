import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#17141f",
      }}
    >
      <div style={{ width: 108, height: 108, background: "#e8558a", clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#17141f", fontSize: 66, fontWeight: 800 }}>
        S
      </div>
    </div>,
    size,
  );
}
