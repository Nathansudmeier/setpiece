import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "on-dark";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  style?: CSSProperties;
  className?: string;
  "aria-label"?: string;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconPosition = "left",
  disabled = false,
  type = "button",
  href,
  onClick,
  style,
  className,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const cls = `sp-btn sp-btn--${variant} sp-btn--${size}${className ? ` ${className}` : ""}`;
  const inner = (
    <>
      {icon && iconPosition === "left" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} style={style} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      style={style}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}
