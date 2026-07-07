import type { CSSProperties, ReactNode } from "react";

type PlayMarkerProps = {
  n: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  variant?: "light" | "dark";
  style?: CSSProperties;
};

export default function PlayMarker({
  n,
  title,
  children,
  variant = "light",
  style,
}: PlayMarkerProps) {
  return (
    <div
      className={`sp-playmarker sp-playmarker--${variant === "dark" ? "on-dark" : "light"}`}
      style={style}
    >
      <span className="sp-playmarker__ring">
        <span className="sp-playmarker__num">{n}</span>
      </span>
      {title && <h3 className="sp-playmarker__title">{title}</h3>}
      {children && <p className="sp-playmarker__body">{children}</p>}
    </div>
  );
}
