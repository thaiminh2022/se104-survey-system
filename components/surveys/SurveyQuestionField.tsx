import { Label } from "@/components/ui/label";
import type { Question } from "@/lib/types/question-type";
import { SurveyQuestionInput } from "./response/SurveyQuestionInput";

type Props = {
  index: number;
  question: Question;
};

export function SurveyQuestionField({ index, question }: Props) {
  return (
    <div className="space-y-3 rounded-lg border border-border/60 p-4">
      <div className="space-y-1">
        <Label className="text-base font-medium">
          {index + 1}. {question.title}
          {question.required ? (
            <span className="text-destructive"> *</span>
          ) : null}
        </Label>
        {question.description ? (
          <p className="text-sm text-muted-foreground">
            {question.description}
          </p>
        ) : null}
      </div>
      <SurveyQuestionInput question={question} />
    </div>
  );
}
