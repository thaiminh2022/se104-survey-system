import { CardTitle, CardDescription } from "@/components/ui/card";
import { FieldSet, FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { Question } from "@/types/survey-create/question-type";

interface QuestionHeaderProps {
  info: Question;
  qIndex: number;
  showDesc: boolean;
  sIndex: number;
}

export default function QuestionHeader({
  info,
  qIndex,
  showDesc,
  sIndex,
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
                updateQuestionTitle(sIndex, qIndex, e.target.value)
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
                updateQuestionDescription(sIndex, qIndex, e.target.value)
              }
            />
          </Field>
        </CardDescription>
      </FieldGroup>
    </FieldSet>
  );
}
