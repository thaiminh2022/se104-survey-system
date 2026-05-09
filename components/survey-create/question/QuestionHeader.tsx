import { CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { Question } from "@/types/question-type";

interface QuestionHeaderProps {
  info: Question;
  sectionID: string;
  showDesc: boolean;
}

export default function QuestionHeader({
  info,
  sectionID,
  showDesc,
}: QuestionHeaderProps) {
  const updateQuestionTitle = useSurveyStore((s) => s.updateQuestionTitle);
  const updateQuestionDescription = useSurveyStore(
    (s) => s.updateQuestionDescription,
  );
  return (
    <FieldSet className="w-full">
      <FieldGroup>
        <CardTitle>
          <Field>
            <FieldLabel htmlFor="question-title">Question Title</FieldLabel>
            <Input
              id="question-title"
              type="text"
              placeholder="Default"
              value={info.title}
              onChange={(e) =>
                updateQuestionTitle(sectionID, info.id, e.target.value)
              }
            />
          </Field>
        </CardTitle>
        <CardDescription hidden={!showDesc}>
          <Field>
            <FieldLabel htmlFor="question-description">Description</FieldLabel>
            <Textarea
              id="question-description"
              value={info.description}
              onChange={(e) =>
                updateQuestionDescription(sectionID, info.id, e.target.value)
              }
            />
          </Field>
        </CardDescription>
      </FieldGroup>
    </FieldSet>
  );
}
