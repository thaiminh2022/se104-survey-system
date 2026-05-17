type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSurveyPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="mx-auto w-3/4 py-6 lg:w-1/2">
      <h1 className="text-3xl font-bold">Edit survey</h1>
      <p className="mt-3 text-muted-foreground">
        Edit UI for survey {id} is not implemented yet.
      </p>
    </main>
  );
}
