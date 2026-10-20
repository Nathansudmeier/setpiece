import { CmsHome } from "@/components/workspoor/WorkspoorHome";
import { CmsKansenscan } from "@/components/cms/pages/kansenscan";
import { CmsWerkwijze } from "@/components/cms/pages/werkwijze";
import { CmsPraktijkvoorbeelden } from "@/components/cms/pages/praktijkvoorbeelden";
import { CmsOver } from "@/components/cms/pages/over";
import { CmsContact } from "@/components/cms/pages/contact";
import type { CmsCopy, CmsSlug } from "@/lib/cms/schema";
export default function Preview({
  slug,
  copy,
  sharedCopy,
}: {
  slug: CmsSlug;
  copy: CmsCopy;
  sharedCopy: CmsCopy;
}) {
  const props = { copy, sharedCopy, preview: true };
  switch (slug) {
    case "home":
      return <CmsHome {...props} />;
    case "kansenscan":
      return <CmsKansenscan {...props} />;
    case "werkwijze":
      return <CmsWerkwijze {...props} />;
    case "praktijkvoorbeelden":
      return <CmsPraktijkvoorbeelden {...props} />;
    case "over":
      return <CmsOver {...props} />;
    case "contact":
      return <CmsContact {...props} />;
    default:
      return null;
  }
}
