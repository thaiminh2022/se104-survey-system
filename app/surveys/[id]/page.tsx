import SurveyResponseForm from "@/components/surveys/SurveyResponseForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getFakeSurveyById,
  getPublishedSurveyById,
} from "@/lib/actions/read_survey";
import { ActionState } from "@/lib/types/errors";
import { Survey } from "@/lib/types/question-type";
import { IconFileReport } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function Page(props: Props) {
  const params = await props.params;
  const id = params.id;
  let surveyRes: ActionState<Survey>;

  if (id === "test") {
    surveyRes = await getFakeSurveyById(id);
  } else {
    surveyRes = await getPublishedSurveyById(id);
  }

  if (!surveyRes.success) {
    if (surveyRes.message === "Authentication required for this survey.") {
      const params = new URLSearchParams({ returnUrl: `/surveys/${id}` });
      redirect(`/auth/login?${params.toString()}`);
    }

    return <>Cannot fetch survey: {surveyRes.message}</>;
  }
  const survey = surveyRes.data;
  if (survey.state == "draft" || survey.state == "archived") {
    return <>You are not allowed to view this survey</>;
  }
  return (
    <>
      <SurveyTitle title={survey.title} description={survey.description} />
      <SurveyResponseForm survey={survey} />
    </>
  );
}
function SurveyTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <CardAction>
          <Link href="#">
            <Button variant={"destructive"}>
              <IconFileReport />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
