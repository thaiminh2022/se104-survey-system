import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { Question } from "@/lib/types/question-type";
import { useState } from "react";
import { useAnswerWriter } from "./useAnswerWriter";

export function DateTimeInput({
  question,
}: {
  question: Question<"date-time">;
}) {
  const setAnswer = useAnswerWriter();
  const mode = question.config.mode;

  return (
    <Input
      type={
        mode === "date" ? "date" : mode === "time" ? "time" : "datetime-local"
      }
      required={question.required}
      onChange={(event) =>
        setAnswer(question.id, {
          answer_type: "date-time",
          config: { value: event.target.value },
        })
      }
    />
  );
}

export function ConsentInput({ question }: { question: Question<"consent"> }) {
  const setAnswer = useAnswerWriter();

  return (
    <Field orientation="horizontal">
      <Checkbox
        id={`${question.id}-consent`}
        required={question.required}
        onCheckedChange={(checked) =>
          setAnswer(question.id, {
            answer_type: "consent",
            config: { accepted: checked === true },
          })
        }
      />
      <FieldLabel htmlFor={`${question.id}-consent`} className="font-normal">
        {question.config.label}
      </FieldLabel>
    </Field>
  );
}

export function NumberInput({ question }: { question: Question<"number"> }) {
  const config = question.config;
  const setAnswer = useAnswerWriter();
  const helpMessage = `Input ${config.isInteger ? "an integer" : "a number"} from ${config.min} to ${config.max}`;
  const [rangeValue, setRangeValue] = useState<number[]>([
    config.min,
    config.max,
  ]);

  return (
    <>
      <FieldDescription>{helpMessage}</FieldDescription>
      <Input
        hidden={config.isRange}
        type="number"
        min={config.min}
        max={config.max}
        step={config.isInteger ? 1 : "any"}
        required={question.required}
        name={question.id}
        onChange={(event) =>
          setAnswer(question.id, {
            answer_type: "number",
            config: {
              is_range: false,
              answer: event.target.valueAsNumber,
            },
          })
        }
      />
      <div hidden={!config.isRange} className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{rangeValue.join(" - ")}</span>
        </div>
        <Slider
          value={rangeValue}
          name={question.id}
          onValueChange={(value) => {
            setRangeValue(value);
            setAnswer(question.id, {
              answer_type: "number",
              config: {
                is_range: true,
                from: value[0],
                to: value[1],
              },
            });
          }}
          min={config.min}
          max={config.max}
          step={config.isInteger ? 1 : 0.1}
        />
      </div>
    </>
  );
}
