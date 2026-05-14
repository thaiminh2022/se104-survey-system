import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Answer, AnswerForm } from "@/types/answer-type";
import type { Question } from "@/types/question-type";
import { IconBackspace } from "@tabler/icons-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  question: Question;
};

export function SurveyQuestionInput({ question }: Props) {
  switch (question.question_type) {
    case "single-choice":
      return <SingleChoiceInput question={question} />;
    case "multiple-choice":
      return <MultipleChoiceInput question={question} />;
    case "rating-scale":
      return <RatingScaleInput question={question} />;
    case "likert-scale":
      return <LikertScaleInput question={question} />;
    case "short-text":
      return <ShortTextInput question={question} />;
    case "long-text":
      return <LongTextInput question={question} />;
    case "dropdown":
      return <DropDownInput question={question} />;
    case "yes-no":
      return <YesNoInput question={question} />;
    case "matrix":
      return <MatrixInput question={question} />;
    case "ranking":
      return <RankingInput question={question} />;
    case "date-time":
      return <DateTimeInput question={question} />;
    case "consent":
      return <ConsentInput question={question} />;
    case "number":
      return <NumberInput question={question} />;
  }
}

function useAnswerWriter() {
  const form = useFormContext<AnswerForm>();

  return (questionId: string, answer: Answer) => {
    form.setValue(`answers.${questionId}`, answer, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
}

function ShortTextInput({ question }: { question: Question<"short-text"> }) {
  const setAnswer = useAnswerWriter();

  return (
    <Input
      placeholder={question.config.placeholder}
      maxLength={question.config.maxLength}
      required={question.required}
      onChange={(event) =>
        setAnswer(question.id, {
          answer_type: "short-text",
          config: { text: event.target.value },
        })
      }
    />
  );
}

function LongTextInput({ question }: { question: Question<"long-text"> }) {
  const setAnswer = useAnswerWriter();

  return (
    <Textarea
      placeholder={question.config.placeholder ?? "Your answer"}
      maxLength={question.config.maxLength}
      required={question.required}
      onChange={(event) =>
        setAnswer(question.id, {
          answer_type: "long-text",
          config: { text: event.target.value },
        })
      }
    />
  );
}

function SingleChoiceInput({
  question,
}: {
  question: Question<"single-choice">;
}) {
  const setAnswer = useAnswerWriter();
  const [usingOther, setUsingOther] = useState(false);

  return (
    <div className="space-y-3">
      <RadioGroup
        onValueChange={(value) => {
          setUsingOther(false);
          setAnswer(question.id, {
            answer_type: "single-choice",
            config: { use_other: false, selected_option: value },
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
      {question.config.haveOther ? (
        <Input
          type="text"
          placeholder="Other"
          onFocus={() => setUsingOther(true)}
          onChange={(event) => {
            setUsingOther(true);
            setAnswer(question.id, {
              answer_type: "single-choice",
              config: { use_other: true, other_answer: event.target.value },
            });
          }}
          className={usingOther ? "border-primary" : undefined}
        />
      ) : null}
    </div>
  );
}

function MultipleChoiceInput({
  question,
}: {
  question: Question<"multiple-choice">;
}) {
  const setAnswer = useAnswerWriter();
  const [selected, setSelected] = useState<string[]>([]);

  function updateSelected(option: string, checked: boolean) {
    const next = checked
      ? [...selected, option]
      : selected.filter((value) => value !== option);
    setSelected(next);
    setAnswer(question.id, {
      answer_type: "multiple-choice",
      config: { use_other: false, selected_options: next },
    });
  }

  return (
    <div className="space-y-3">
      <FieldSet>
        <FieldGroup className="gap-3">
          {question.config.options.map((option, index) => {
            const identifier = `${question.id}-${option}-${index}`;
            return (
              <Field orientation="horizontal" key={identifier}>
                <Checkbox
                  id={identifier}
                  checked={selected.includes(option)}
                  onCheckedChange={(checked) =>
                    updateSelected(option, checked === true)
                  }
                />
                <FieldLabel htmlFor={identifier} className="font-normal">
                  {option}
                </FieldLabel>
              </Field>
            );
          })}
        </FieldGroup>
      </FieldSet>
      {question.config.haveOther ? (
        <Input
          type="text"
          placeholder="Other"
          onChange={(event) =>
            setAnswer(question.id, {
              answer_type: "multiple-choice",
              config: { use_other: true, other_answer: event.target.value },
            })
          }
        />
      ) : null}
    </div>
  );
}

function RatingScaleInput({
  question,
}: {
  question: Question<"rating-scale">;
}) {
  const setAnswer = useAnswerWriter();
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

function LikertScaleInput({
  question,
}: {
  question: Question<"likert-scale">;
}) {
  const setAnswer = useAnswerWriter();

  return (
    <RadioGroup
      onValueChange={(value) =>
        setAnswer(question.id, {
          answer_type: "likert-scale",
          config: { selected_option: value },
        })
      }
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

function DropDownInput({ question }: { question: Question<"dropdown"> }) {
  const setAnswer = useAnswerWriter();

  return (
    <Select
      required={question.required}
      onValueChange={(value) =>
        setAnswer(question.id, {
          answer_type: "dropdown",
          config: { selected_option: value },
        })
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {question.config.options.map((option) => (
          <SelectItem value={option} key={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function YesNoInput({ question }: { question: Question<"yes-no"> }) {
  const setAnswer = useAnswerWriter();

  return (
    <RadioGroup
      onValueChange={(value) =>
        setAnswer(question.id, {
          answer_type: "yes-no",
          config: { value: value === "yes" },
        })
      }
    >
      <div className="flex items-center gap-3">
        <RadioGroupItem value="yes" id={`${question.id}-yes`} />
        <Label htmlFor={`${question.id}-yes`}>
          {question.config.yesLabel ?? "Yes"}
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="no" id={`${question.id}-no`} />
        <Label htmlFor={`${question.id}-no`}>
          {question.config.noLabel ?? "No"}
        </Label>
      </div>
    </RadioGroup>
  );
}

function MatrixInput({ question }: { question: Question<"matrix"> }) {
  const setAnswer = useAnswerWriter();
  const [rows, setRows] = useState<Record<string, string | string[]>>({});

  function updateRow(row: string, value: string, checked?: boolean) {
    const next = { ...rows };
    if (question.config.multiplePerRow) {
      const current = Array.isArray(next[row]) ? next[row] : [];
      next[row] = checked
        ? [...current, value]
        : current.filter((item) => item !== value);
    } else {
      next[row] = value;
    }
    setRows(next);
    setAnswer(question.id, {
      answer_type: "matrix",
      config: { rows: next },
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr>
            <th className="py-2 text-left font-medium"></th>
            {question.config.columns.map((column) => (
              <th className="px-3 py-2 text-center font-medium" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.config.rows.map((row) => (
            <tr className="border-t" key={row}>
              <td className="py-3 pr-3 font-medium">{row}</td>
              {question.config.columns.map((column) => (
                <td className="px-3 py-3 text-center" key={column}>
                  {question.config.multiplePerRow ? (
                    <Checkbox
                      checked={
                        Array.isArray(rows[row]) && rows[row].includes(column)
                      }
                      onCheckedChange={(checked) =>
                        updateRow(row, column, checked === true)
                      }
                    />
                  ) : (
                    <RadioGroup
                      value={typeof rows[row] === "string" ? rows[row] : ""}
                      onValueChange={(value) => updateRow(row, value)}
                    >
                      <RadioGroupItem value={column} />
                    </RadioGroup>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RankingInput({ question }: { question: Question<"ranking"> }) {
  const setAnswer = useAnswerWriter();
  const [rankedOptions, setRankedOptions] = useState<string[]>([]);

  function updateRank(index: number, value: string) {
    const next = [...rankedOptions];
    next[index] = value;
    setRankedOptions(next);
    setAnswer(question.id, {
      answer_type: "ranking",
      config: { ranked_options: next.filter(Boolean) },
    });
  }

  return (
    <div className="space-y-3">
      {question.config.options.map((_, index) => (
        <div className="flex items-center gap-3" key={index}>
          <span className="w-8 text-sm text-muted-foreground">#{index + 1}</span>
          <Select onValueChange={(value) => updateRank(index, value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {question.config.options.map((option) => (
                <SelectItem
                  value={option}
                  key={option}
                  disabled={rankedOptions.includes(option)}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

function DateTimeInput({ question }: { question: Question<"date-time"> }) {
  const setAnswer = useAnswerWriter();
  const mode = question.config.mode;

  return (
    <Input
      type={mode === "date" ? "date" : mode === "time" ? "time" : "datetime-local"}
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

function ConsentInput({ question }: { question: Question<"consent"> }) {
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

function NumberInput({ question }: { question: Question<"number"> }) {
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
