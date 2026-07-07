import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  variant?: "surface" | "tint" | "dark" | "outline";
  interactive?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function Card({
  children,
  variant = "surface",
  interactive = false,
  style,
  className,
  onClick,
}: CardProps) {
  return (
    <div
      className={`sp-card sp-card--${variant}${interactive ? " sp-card--interactive" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
