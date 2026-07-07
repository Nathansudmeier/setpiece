import type { CSSProperties, ReactNode } from "react";

type ToastProps = {
  title?: ReactNode;
  message?: ReactNode;
  variant?: "success" | "info" | "highlight";
  style?: CSSProperties;
};

export default function Toast({ title, message, variant = "info", style }: ToastProps) {
  return (
    <div className={`sp-toast sp-toast--${variant}`} style={style}>
      <span className="sp-toast__accent" />
      <span className="sp-toast__body">
        {title && <span className="sp-toast__title">{title}</span>}
        {message && <span className="sp-toast__msg">{message}</span>}
      </span>
    </div>
  );
}
