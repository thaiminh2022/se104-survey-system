import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertQuestionTypeToName } from "@/lib/helper";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { Question } from "@/lib/types/question-type";

interface QuestionHeaderProps {
  info: Question;
  index: number;
  sectionID: string;
  showDesc: boolean;
  isActive: boolean;
}

export default function QuestionHeader({
  info,
  index,
  sectionID,
  showDesc,
  isActive,
}: QuestionHeaderProps) {
  const updateQuestionTitle = useSurveyStore((s) => s.updateQuestionTitle);
  const updateQuestionDescription = useSurveyStore(
    (s) => s.updateQuestionDescription,
  );

  return (
    <FieldSet className="w-full">
      <FieldGroup>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Question {index + 1}</Badge>
          <Badge variant="secondary">
            {convertQuestionTypeToName(info.question_type)}
          </Badge>
          {info.required ? <Badge>Required</Badge> : null}
        </div>
        <CardTitle>
          <Field>
            <FieldLabel
              htmlFor={`question-title-${info.id}`}
              hidden={!isActive}
            >
              Question title
            </FieldLabel>
            <Input
              id={`question-title-${info.id}`}
              type="text"
              placeholder="Ask a clear question"
              value={info.title}
              className="h-auto rounded-none border-x-0 border-t-0 bg-transparent px-0 py-1 text-lg font-medium shadow-none focus-visible:ring-0"
              onChange={(event) =>
                updateQuestionTitle(sectionID, info.id, event.target.value)
              }
            />
          </Field>
        </CardTitle>
        <CardDescription hidden={!isActive || !showDesc}>
          <Field>
            <FieldLabel htmlFor={`question-description-${info.id}`}>
              Description
            </FieldLabel>
            <Textarea
              id={`question-description-${info.id}`}
              placeholder="Add helper text for respondents."
              value={info.description}
              onChange={(event) =>
                updateQuestionDescription(sectionID, info.id, event.target.value)
              }
            />
          </Field>
        </CardDescription>
      </FieldGroup>
    </FieldSet>
  );
}
