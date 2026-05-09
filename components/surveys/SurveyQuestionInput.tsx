import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Answer, AnswerForm } from "@/types/answer-type";
import type { Question } from "@/types/question-type";
import { IconBackspace } from "@tabler/icons-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type Props = {
  question: Question;
};

export function SurveyQuestionInput({ question }: Props) {
  switch (question.question_type) {
    case "short-answer":
      return <ShortAnswerInput question={question} />;
    case "long-answer":
      return <LongAnswerInput question={question} />;
    case "multiple-choice":
      return <MultipleChoiceInput question={question} />;
    case "checkbox":
      return <CheckboxInput question={question} />;
    case "dropdown":
      return <DropDownInput question={question} />;
    case "datetime":
      return <DateTimeInput question={question} />;
    case "number":
      return <NumberInput question={question} />;
    case "rating":
      return <RatingInput question={question} />;
  }
}
interface ShortAnswerInputProps {
  question: Question<"short-answer">;
}

function ShortAnswerInput({ question }: ShortAnswerInputProps) {
  const form = useFormContext<AnswerForm>();

  return (
    <Input
      placeholder={question.config.placeholder}
      required={question.required}
      onChange={(e) => {
        const answer: Answer = {
          answer_type: question.question_type,
          config: {
            answer: e.target.value,
          },
        };
        form.setValue(`answers.${question.id}`, answer);
      }}
    />
  );
}

interface LongAnswerInputProps {
  question: Question<"long-answer">;
}

function LongAnswerInput({ question }: LongAnswerInputProps) {
  const form = useFormContext<AnswerForm>();

  return (
    <Textarea
      placeholder={question.config.placeholder ?? "Your answer"}
      required={question.required}
      onChange={(e) => {
        const answer: Answer = {
          answer_type: question.question_type,
          config: {
            answer: e.target.value,
          },
        };
        form.setValue(`answers.${question.id}`, answer);
      }}
    />
  );
}
interface DropDownInputProps {
  question: Question<"dropdown">;
}
function DropDownInput({ question }: DropDownInputProps) {
  return (
    <Select required={question.required}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  );
}

interface DateTimeInputProps {
  question: Question<"datetime">;
}

function DateTimeInput({ question }: DateTimeInputProps) {
  const dateTimeConfig = question.config;
  const mode = dateTimeConfig.mode;
  const form = useFormContext<AnswerForm>();

  return (
    <Input
      type={
        mode === "date" ? "date" : mode === "time" ? "time" : "datetime-local"
      }
      required={question.required}
      onChange={(e) => {
        const date = e.target.valueAsDate;
        if (date == null) return;
        const answer:   Answer = {
          answer_type: question.question_type,
          config: {
            answer: date,
          },
        };
        form.setValue(`answers.${question.id}`, answer);
      }}
    />
  );
}
interface NumberInputProps {
  question: Question<"number">;
}
function NumberInput({ question }: NumberInputProps) {
  const config = question.config;
  const form = useFormContext<AnswerForm>();
  return (
    <Input
      type="number"
      min={config.min}
      max={config.max}
      step={config.isInteger ? 1 : "any"}
      required={question.required}
      onChange={(e) => {
        const answer: Answer = {
          answer_type: question.question_type,
          config: {
            answer: e.target.valueAsNumber,
          },
        };
        form.setValue(`answers.${question.id}`, answer);
      }}
    />
  );
}

interface MultipleChoiceInputProps {
  question: Question<"multiple-choice">;
}
function MultipleChoiceInput({ question }: MultipleChoiceInputProps) {
  const haveOther = question.config.haveOther ?? false;
  const form = useFormContext<AnswerForm>();

  return (
    <>
      <RadioGroup
        defaultValue="comfortable"
        className="w-fit"
        onValueChange={(e) => {
          const answer: Answer = {
            answer_type: question.question_type,
            config: {
              selected_option: e,
              use_other: false,
            },
          };
          form.setValue(`answers.${question.id}`, answer);
        }}
      >
        {question.config.options.map((op, index) => {
          const identifier = question.id + op + index;
          return (
            <div className="flex items-center gap-3" key={identifier}>
              <RadioGroupItem value={op} id={identifier} />
              <Label htmlFor={identifier}>{op}</Label>
            </div>
          );
        })}
      </RadioGroup>
      <Input
        type="text"
        hidden={!haveOther}
        placeholder="Other"
        onChange={(e) => {
          const answer: Answer = {
            answer_type: question.question_type,
            config: { use_other: true, other_answer: e.target.value },
          };
          form.setValue(`answers.${question.id}`, answer);
        }}
      />
    </>
  );
}

interface CheckboxInputProps {
  question: Question<"checkbox">;
}
function CheckboxInput({ question }: CheckboxInputProps) {
  const haveOther = question.config.haveOther ?? false;
  const [selected, setSelected] = useState<string[]>([]);

  function toggleItem(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((value) => value !== id),
    );
  }
  const form = useFormContext<AnswerForm>();

  return (
    <>
      <FieldSet>
        <FieldGroup className="gap-3">
          {question.config.options.map((op, index) => {
            const identifier = question.id + op + index;
            return (
              <Field orientation="horizontal" key={identifier}>
                <Checkbox
                  id={identifier}
                  checked={selected.includes(op)}
                  onCheckedChange={(e) => {
                    toggleItem(op, e === true);
                    const answer: Answer = {
                      answer_type: question.question_type,
                      config: {
                        use_other: false,
                        selected_options: selected,
                      },
                    };
                    form.setValue(`answers.${question.id}`, answer);
                  }}
                />
                <FieldLabel htmlFor={identifier} className="font-normal">
                  {op}
                </FieldLabel>
              </Field>
            );
          })}
        </FieldGroup>
      </FieldSet>
      <Input
        type="text"
        hidden={!haveOther}
        placeholder="Other"
        onChange={(e) => {
          const answer: Answer = {
            answer_type: question.question_type,
            config: { use_other: true, other_answer: e.target.value },
          };
          form.setValue(`answers.${question.id}`, answer);
        }}
      />
    </>
  );
}

interface RatingInputProps {
  question: Question<"rating">;
}

function RatingInput({ question }: RatingInputProps) {
  const form = useFormContext<AnswerForm>();
  const [rate, selectedRate] = useState<undefined | number>(undefined);
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          type="button"
          size="icon"
          variant={rating <= (rate ?? -1) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => {
            const answer: Answer = {
              answer_type: question.question_type,
              config: {
                rating: rating,
              },
            };
            selectedRate(rating);
            form.setValue(`answers.${question.id}`, answer);
          }}
        >
          {rating}
        </Button>
      ))}
      <Button
        variant={"destructive"}
        onClick={() => {
          selectedRate(undefined);
          form.resetField(`answers.${question.id}`);
        }}
      >
        <IconBackspace />
      </Button>
    </div>
  );
}
