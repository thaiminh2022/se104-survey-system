import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnswerForm } from "@/lib/types/answer-type";
import type { Question } from "@/lib/types/question-type";
import { IconBackspace } from "@tabler/icons-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAnswerWriter } from "./useAnswerWriter";

export function RatingScaleInput({
  question,
}: {
  question: Question<"rating-scale">;
}) {
  const { setAnswer } = useAnswerWriter();
  const form = useFormContext<AnswerForm>();
  const [ratingValue, setRatingValue] = useState<number | undefined>(undefined);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            type="button"
            size="icon"
            variant={ratingValue === rating ? "default" : "outline"}
            onClick={() => {
              setRatingValue(rating);
              setAnswer(question.id, {
                answer_type: "rating-scale",
                config: { rating },
              });
            }}
          >
            {rating}
          </Button>
        ))}
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            setRatingValue(undefined);
            form.resetField(`answers.${question.id}`);
          }}
        >
          <IconBackspace />
        </Button>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{question.config.minLabel}</span>
        <span>{question.config.maxLabel}</span>
      </div>
    </div>
  );
}

export function LikertScaleInput({
  question,
}: {
  question: Question<"likert-scale">;
}) {
  const { clearAnswer, setAnswer } = useAnswerWriter();

  return (
    <RadioGroup
      onValueChange={(value) => {
        if (!question.config.options.includes(value)) {
          clearAnswer(question.id);
          return;
        }

        setAnswer(question.id, {
          answer_type: "likert-scale",
          config: { selected_option: value },
        });
      }}
    >
      {question.config.options.map((option, index) => {
        const identifier = `${question.id}-${option}-${index}`;
        return (
          <div className="flex items-center gap-3" key={identifier}>
            <RadioGroupItem value={option} id={identifier} />
            <Label htmlFor={identifier}>{option}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
