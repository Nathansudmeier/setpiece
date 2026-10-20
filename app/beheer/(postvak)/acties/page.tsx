import WorkIndex from "@/components/beheer/WorkIndex";
export const metadata = { title: "Acties" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; workspace?: string; status?: string }>;
}) {
  return <WorkIndex kind="task" title="Acties" params={await searchParams} />;
}
