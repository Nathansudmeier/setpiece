import type { CSSProperties, ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "amber" | "nacht" | "tint" | "outline";
  dot?: boolean;
  style?: CSSProperties;
};

export default function Badge({ children, variant = "amber", dot = false, style }: BadgeProps) {
  return (
    <span className={`sp-badge sp-badge--${variant}${dot ? " sp-badge--dot" : ""}`} style={style}>
      {children}
    </span>
  );
}
