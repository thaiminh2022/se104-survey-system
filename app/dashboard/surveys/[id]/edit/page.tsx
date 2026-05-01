import { SiteHeader } from "@/components/dashboard/site-header";

type Props = { params: Promise<{ id: string }> };

export default async function (props: Props) {
  const params = await props.params;
  const id = params.id;
  return (
    <>
      <SiteHeader header="Edit" />
      <h1>Editing for: {id}</h1>
    </>
  );
}
