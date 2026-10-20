import type { ReactNode } from "react";
import WorkspoorFooter from "./WorkspoorFooter";
import WorkspoorHeader from "./WorkspoorHeader";
import { readPublished } from "@/lib/cms/read";
import type { CmsCopy } from "@/lib/cms/schema";
import { sharedContent } from "@/lib/cms/shared";
export default async function WorkspoorShell({
  children,
  activePath,
  darkHeader,
  sharedCopy,
  preview = false,
}: {
  children: ReactNode;
  activePath?: string;
  darkHeader?: boolean;
  sharedCopy?: CmsCopy;
  preview?: boolean;
}) {
  const copy = sharedCopy ?? (await readPublished("shared"));
  return (
    <div className="ws-site">
      <WorkspoorHeader
        activePath={activePath}
        dark={darkHeader}
        navItems={sharedContent(copy).WORKSPOOR_NAV}
        ctaLabel={copy.cta_label}
        ctaHref={copy.link_cta}
        trainingLabel={copy.header_training}
        serviceLabel={copy.header_service}
      />
      {preview ? (
        <div className="ws-preview-content">{children}</div>
      ) : (
        <main id="main-content">{children}</main>
      )}
      <WorkspoorFooter copy={copy} />
    </div>
  );
}
