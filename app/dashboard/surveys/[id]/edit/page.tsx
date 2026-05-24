import SurveyBuilder from "@/components/dashboard/survey-create/SurveyBuilder";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSurveyById } from "@/lib/actions/read_survey";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSurveyPage({ params }: Props) {
  const { id } = await params;
  const surveyResult = await getSurveyById(id);

  if (!surveyResult.success) {
    return (
      <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Cannot load survey</CardTitle>
              <CardDescription>{surveyResult.message}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return <SurveyBuilder mode="edit" initialSurvey={surveyResult.data} />;
}
