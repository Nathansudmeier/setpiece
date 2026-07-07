import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  variant?: "surface" | "tint" | "dark" | "outline";
  interactive?: boolean;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function Card({
  children,
  variant = "surface",
  interactive = false,
  style,
  onClick,
}: CardProps) {
  return (
    <div
      className={`sp-card sp-card--${variant}${interactive ? " sp-card--interactive" : ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
