import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFakeSurveyById, getSurveyById } from "@/lib/actions/read_survey";
import { Survey } from "@/types/question-type";
import { IconFileReport, IconReport } from "@tabler/icons-react";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };


export default async function Page(props: Props) {
  const params = await props.params;
  const id = params.id;
  const surveyRes = await getFakeSurveyById(id);
  if (!surveyRes.success) {
    return <>Cannot fetch survey {surveyRes.error}</>;
  }
  const survey = surveyRes.data;
  if (survey.state == "draft" || survey.state == "archived") {
    return <>You are not allowed to view this survey</>;
  }

  return <>
    <SurveyTitle title={survey.title} description={survey.description} />
    {/* Sections */}
    
  </>

}
function SurveyTitle({title, description}: { title: string, description: string }) {
  return <Card className="mt-3">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>

      <CardAction>
        <Link href="#">
          <Button variant={"destructive"}><IconFileReport /></Button>
        </Link>
      </CardAction>
    </CardHeader>
  </Card>;
}

