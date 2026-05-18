import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export default async function Page(props: Props) {
  const params = await props.params;
  const id = params.id;

  return (
    <>
      <main>
        <h1>Exporting stuff</h1>
        <h2>Export answers:</h2>
        <Button>Export as csv</Button>
        <Button>Save charts as pdf</Button>
      </main>
    </>
  );
}
