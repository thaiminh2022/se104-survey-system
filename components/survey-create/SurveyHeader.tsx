import { submitSurvey } from "@/actions/create_survey";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { IconSend } from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function SurveyHeader() {
  const survey = useSurveyStore((s) => s.survey);
  const updateSurveyTitle = useSurveyStore((s) => s.updateSurveyTitle);
  const updateSurveyDescription = useSurveyStore(
    (s) => s.updateSurveyDescription,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <input
            type="text"
            className="text-3xl w-full focus:outline-0 border-b-accent border-b-2 focus:border-b-accent-foreground transition-colors"
            placeholder="Survey title"
            value={survey.title}
            onChange={(e) => updateSurveyTitle(e.target.value)}
          />
        </CardTitle>
        <CardAction>
          <Button
            className="rounded-md"
            onClick={async () => {
              console.log(await submitSurvey(survey));
            }}
          >
            <IconSend />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-5">
        <textarea
          placeholder="Survey description"
          className="w-full focus:outline-0 h-5 transitions-color border-b-accent border-b-2 focus:border-b-accent-foreground"
          value={survey.description}
          onChange={(e) => updateSurveyDescription(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
