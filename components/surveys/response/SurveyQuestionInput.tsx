import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  CheckBoxQuestionConfig,
  DatetimeQuestionConfig,
  MultipleChoiceQuestionConfig,
  NumberQuestionConfig,
  Question,
} from "@/types/question-type";
import type { AnswerValue } from "./types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  question: Question;
};

export function SurveyQuestionInput({ question }: Props) {
  const { register, setValue } = useFormContext();

  switch (question.question_type) {
    case "short-answer":
      return (
        <Input
          {...register(question.id)}
          placeholder={question.config.placeholder ?? "Your answer"}
        />
      );
    case "long-answer":
      return (
        <Textarea
          {...register(question.id)}
          placeholder={question.config.placeholder ?? "Your answer"}
        />
      );
    case "multiple-choice":
      return (
        <OptionList
          questionId={question.id}
          config={question.config as MultipleChoiceQuestionConfig}
        />
      );
    case "checkbox":
      return (
        <CheckboxList
          questionId={question.id}
          config={question.config as CheckBoxQuestionConfig}
        />
      );
    case "dropdown":
      return (
        <Select {...register(question.id)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option-1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
    case "datetime":
      const dateTimeConfig = question.config as DatetimeQuestionConfig;
      const mode = dateTimeConfig.mode;
      return (
        <Input
          type={
            mode === "date"
              ? "date"
              : mode === "time"
                ? "time"
                : "datetime-local"
          }
          {...register(question.id)}
        />
      );
    case "number": {
      const config = question.config as NumberQuestionConfig;
      return (
        <Input
          type="number"
          min={config.min}
          max={config.max}
          step={config.isInteger ? 1 : "any"}
          {...register(question.id)}
        />
      );
    }
    case "rating":
      return (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              size="icon"
              aria-label={`Rate ${rating}`}
              onClick={() => {
                setValue(question.id, rating);
              }}
            >
              {rating}
            </Button>
          ))}
        </div>
      );
  }
}

function OptionList({
  config,
  questionId,
}: {
  config: MultipleChoiceQuestionConfig;
  questionId: string;
}) {
  const options = config.options.length > 0 ? config.options : ["Option 1"];
  const { register } = useFormContext();

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-3 text-sm">
          <input
            type="radio"
            className="size-4 accent-primary"
            {...register(questionId)}
          />
          <span>{option}</span>
        </label>
      ))}
      {config.haveOther ? (
        <Input placeholder="Other" {...register(`${questionId}`)} />
      ) : null}
    </div>
  );
}

function CheckboxList({
  config,
  questionId,
}: {
  config: CheckBoxQuestionConfig;
  questionId: string;
}) {
  const options = config.options.length > 0 ? config.options : ["Option 1"];
  const { control, register, watch } = useFormContext();

  const fieldName = `answers.${questionId}.values`;
  const otherFieldName = `answers.${questionId}.other`;

  const selectedValues = watch(fieldName) ?? [];
  const showOtherInput = selectedValues.includes("other");

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <Controller
          key={option}
          control={control}
          name={fieldName}
          defaultValue={[]}
          render={({ field }) => {
            const currentValues: string[] = field.value ?? [];
            const checked = currentValues.includes(option);

            return (
              <label className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(isChecked) => {
                    if (isChecked) {
                      field.onChange([...currentValues, option]);
                    } else {
                      field.onChange(
                        currentValues.filter((value) => value !== option),
                      );
                    }
                  }}
                />

                <span>{option}</span>
              </label>
            );
          }}
        />
      ))}

      {config.haveOther ? (
        <>
          <Controller
            control={control}
            name={fieldName}
            defaultValue={[]}
            render={({ field }) => {
              const currentValues: string[] = field.value ?? [];
              const checked = currentValues.includes("other");

              return (
                <label className="flex items-center gap-3 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      if (isChecked) {
                        field.onChange([...currentValues, "other"]);
                      } else {
                        field.onChange(
                          currentValues.filter((value) => value !== "other"),
                        );
                      }
                    }}
                  />

                  <span>Other</span>
                </label>
              );
            }}
          />

          {showOtherInput ? (
            <Input placeholder="Other" {...register(otherFieldName)} />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
