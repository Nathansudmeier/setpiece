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
        background: "#0f2a52",
      }}
    >
      <div style={{ width: 108, height: 108, borderRadius: 999, background: "#e8a020", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f2a52", fontSize: 66, fontWeight: 800 }}>
        S
      </div>
    </div>,
    size,
  );
}
