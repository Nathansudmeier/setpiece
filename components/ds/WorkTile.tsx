import type { CSSProperties, ReactNode } from "react";

type WorkTileProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export default function WorkTile({ children, style }: WorkTileProps) {
  return (
    <div className="sp-worktile" style={style}>
      <span className="sp-worktile__corner" aria-hidden="true" />
      <span className="sp-worktile__label">{children}</span>
    </div>
  );
}
