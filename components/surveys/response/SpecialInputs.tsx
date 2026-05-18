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
  const { clearAnswer, setAnswer } = useAnswerWriter();
  const mode = question.config.mode;

  return (
    <Input
      type={
        mode === "date" ? "date" : mode === "time" ? "time" : "datetime-local"
      }
      required={question.required}
      onChange={(event) => {
        if (!event.target.value || !event.target.validity.valid) {
          clearAnswer(question.id);
          return;
        }

        setAnswer(question.id, {
          answer_type: "date-time",
          config: { value: event.target.value },
        });
      }}
    />
  );
}

export function ConsentInput({ question }: { question: Question<"consent"> }) {
  const { clearAnswer, setAnswer } = useAnswerWriter();

  return (
    <Field orientation="horizontal">
      <Checkbox
        id={`${question.id}-consent`}
        required={question.required}
        onCheckedChange={(checked) => {
          if (checked !== true) {
            clearAnswer(question.id);
            return;
          }

          setAnswer(question.id, {
            answer_type: "consent",
            config: { accepted: true },
          });
        }}
      />
      <FieldLabel htmlFor={`${question.id}-consent`} className="font-normal">
        {question.config.label}
      </FieldLabel>
    </Field>
  );
}

export function NumberInput({ question }: { question: Question<"number"> }) {
  const config = question.config;
  const { clearAnswer, setAnswer } = useAnswerWriter();
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
        onChange={(event) => {
          const value = event.target.valueAsNumber;
          if (
            Number.isNaN(value) ||
            value < config.min ||
            value > config.max ||
            (config.isInteger && !Number.isInteger(value))
          ) {
            clearAnswer(question.id);
            return;
          }

          setAnswer(question.id, {
            answer_type: "number",
            config: {
              is_range: false,
              answer: value,
            },
          });
        }}
      />
      <div hidden={!config.isRange} className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{rangeValue.join(" - ")}</span>
        </div>
        <Slider
          value={rangeValue}
          name={question.id}
          onValueChange={(value) => {
            const [from, to] = value;
            if (
              from == null ||
              to == null ||
              from < config.min ||
              to > config.max ||
              from > to ||
              (config.isInteger &&
                (!Number.isInteger(from) || !Number.isInteger(to)))
            ) {
              clearAnswer(question.id);
              return;
            }

            setRangeValue(value);
            setAnswer(question.id, {
              answer_type: "number",
              config: {
                is_range: true,
                from,
                to,
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
