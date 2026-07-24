import type { ReactNode } from "react";

import WorkspoorFooter from "@/components/workspoor/WorkspoorFooter";
import WorkspoorHeader from "@/components/workspoor/WorkspoorHeader";

type WorkspoorShellProps = {
  children: ReactNode;
  activePath?: string;
  darkHeader?: boolean;
};

export default function WorkspoorShell({
  children,
  activePath,
  darkHeader,
}: WorkspoorShellProps) {
  return (
    <div className="ws-site">
      <WorkspoorHeader activePath={activePath} dark={darkHeader} />
      <main id="main-content">{children}</main>
      <WorkspoorFooter />
    </div>
  );
}
