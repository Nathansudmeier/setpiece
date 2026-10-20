import WorkIndex from "@/components/beheer/WorkIndex";
export const metadata = { title: "Beslissingen" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; workspace?: string; status?: string }>;
}) {
  return (
    <WorkIndex
      kind="decision"
      title="Jouw beslissing"
      params={await searchParams}
    />
  );
}
