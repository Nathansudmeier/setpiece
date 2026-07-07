import type { CSSProperties, ReactNode } from "react";

type BigQuoteProps = {
  children: ReactNode;
  by?: ReactNode;
  variant?: "light" | "dark";
  style?: CSSProperties;
};

export default function BigQuote({ children, by, variant = "light", style }: BigQuoteProps) {
  return (
    <div
      className={`sp-bigquote sp-bigquote--${variant === "dark" ? "on-dark" : "light"}`}
      style={style}
    >
      <span className="sp-bigquote__mark" aria-hidden="true">
        ”
      </span>
      <p className="sp-bigquote__text">{children}</p>
      {by && <span className="sp-bigquote__by">{by}</span>}
    </div>
  );
}
