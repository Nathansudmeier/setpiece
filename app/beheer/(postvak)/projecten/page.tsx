import WorkIndex from "@/components/beheer/WorkIndex";
export const metadata = { title: "Projecten" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; workspace?: string; status?: string }>;
}) {
  return (
    <WorkIndex kind="project" title="Projecten" params={await searchParams} />
  );
}
