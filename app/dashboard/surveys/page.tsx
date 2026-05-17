import ChangeStateSurveyButton from "@/components/dashboard/surveys/ChangeStateSurveyBtn";
import SurveyActionsDropdown from "@/components/dashboard/surveys/SurveyActionsDropdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSurveyRowForUser } from "@/lib/actions/read_survey";

export default async function Page() {
  const surveys = await getSurveyRowForUser();
  if (!surveys.success) {
    return <>Cannot fetch surveys {surveys.error}</>;
  }

  return (
    <>
      <div className="mx-auto lg:w-1/2 w-3/4">
        <h1 className="text-3xl font-bold my-3">Your surveys</h1>
        {surveys.data.map((s, i) => {
          return (
            <Card key={i} className="mt-3">
              <CardHeader>
                <div className="flex">
                  <CardTitle>{s.title}</CardTitle>
                  <Badge
                    className="ml-3"
                    variant={s.state == "draft" ? "secondary" : "default"}
                  >
                    {s.state}
                  </Badge>
                  <Badge className="ml-3" variant={"link"}>
                    {new Date(s.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <CardDescription>{s.description}</CardDescription>
                <CardAction className="flex gap-x-3 flex-wrap">
                  <SurveyActionsDropdown surveyId={s.id} />
                  <ChangeStateSurveyButton surveyId={s.id} state={s.state} />
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </>
  );
}
