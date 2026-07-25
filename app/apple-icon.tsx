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
      <svg
        width="82"
        height="102"
        viewBox="0 0 31.617188 38.910156"
        aria-label="Setpiece beeldmerk"
      >
        <path
          d="M0 9.117187L15.808594 0L31.617188 9.117187V21.886719H18.242188L9.730469 13.375H0Z"
          fill="#e8558a"
        />
        <path
          d="M31.617188 29.789063L15.808594 38.910156L0 29.789063V18.238281H13.378907L21.890625 26.75H31.617188Z"
          fill="#e8558a"
        />
      </svg>
    </div>,
    size,
  );
}
