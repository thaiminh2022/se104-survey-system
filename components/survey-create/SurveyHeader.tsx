import { submitSurvey } from "@/actions/create_survey";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "../ui/card";
import { FieldSet, FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useSurveyStore } from "@/stores/survey-create/survey_store";

export default function SurveyHeader() {
  const survey = useSurveyStore((s) => s.survey);
  const updateSurveyTitle = useSurveyStore((s) => s.updateSurveyTitle);
  const updateSurveyDescription = useSurveyStore(
    (s) => s.updateSurveyDescription,
  );
  return (
    <Card>
      <CardHeader>
        <FieldSet className="w-full">
          <FieldGroup>
            <CardTitle>
              <Field>
                <FieldLabel htmlFor="survey-title">Survey Title</FieldLabel>
                <Input
                  id="survey-title"
                  type="text"
                  placeholder="Default"
                  value={survey.title}
                  onChange={(e) => updateSurveyTitle(e.target.value)}
                />
              </Field>
            </CardTitle>
            <CardDescription>
              <Field>
                <FieldLabel htmlFor="survey-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="survey-description"
                  value={survey.description}
                  onChange={(e) => updateSurveyDescription(e.target.value)}
                />
              </Field>
            </CardDescription>
          </FieldGroup>
        </FieldSet>
        <CardAction>
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={() => submitSurvey(survey)}
          >
            Submit
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
