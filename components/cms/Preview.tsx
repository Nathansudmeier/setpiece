import { CmsHome } from "@/components/workspoor/WorkspoorHome";
import { CmsKansenscan } from "@/components/cms/pages/kansenscan";
import { CmsWerkwijze } from "@/components/cms/pages/werkwijze";
import { CmsPraktijkvoorbeelden } from "@/components/cms/pages/praktijkvoorbeelden";
import { CmsOver } from "@/components/cms/pages/over";
import { CmsContact } from "@/components/cms/pages/contact";
import { CmsDiensten } from "@/components/cms/pages/diensten";
import { CmsAiImplementatie } from "@/components/cms/pages/ai-implementatie";
import { CmsAiGroeipartner } from "@/components/cms/pages/ai-groeipartner";
import { CmsAiMaatwerk } from "@/components/cms/pages/ai-maatwerk";
import { CmsAiGeletterdheid } from "@/components/cms/pages/ai-geletterdheid";
import { CmsKennis } from "@/components/cms/pages/kennis";
import { CmsAiGeletterdheidAanvragen } from "@/components/cms/pages/ai-geletterdheid-aanvragen";
import { CmsKennisBedrijfsprocessenAutomatiseren } from "@/components/cms/pages/kennis-bedrijfsprocessen-automatiseren";
import { CmsKennisAiResultaatMeten } from "@/components/cms/pages/kennis-ai-resultaat-meten";
import { CmsKennisAiWerkafspraken } from "@/components/cms/pages/kennis-ai-werkafspraken";
import { CmsKennisAiGeletterdheidVerplicht } from "@/components/cms/pages/kennis-ai-geletterdheid-verplicht";
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
    case "diensten":
      return <CmsDiensten {...props} />;
    case "ai-implementatie":
      return <CmsAiImplementatie {...props} />;
    case "ai-groeipartner":
      return <CmsAiGroeipartner {...props} />;
    case "ai-maatwerk":
      return <CmsAiMaatwerk {...props} />;
    case "ai-geletterdheid":
      return <CmsAiGeletterdheid {...props} />;
    case "kennis":
      return <CmsKennis {...props} />;
    case "ai-geletterdheid-aanvragen":
      return <CmsAiGeletterdheidAanvragen {...props} />;
    case "kennis-bedrijfsprocessen-automatiseren":
      return <CmsKennisBedrijfsprocessenAutomatiseren {...props} />;
    case "kennis-ai-resultaat-meten":
      return <CmsKennisAiResultaatMeten {...props} />;
    case "kennis-ai-werkafspraken":
      return <CmsKennisAiWerkafspraken {...props} />;
    case "kennis-ai-geletterdheid-verplicht":
      return <CmsKennisAiGeletterdheidVerplicht {...props} />;
    default:
      return null;
  }
}
