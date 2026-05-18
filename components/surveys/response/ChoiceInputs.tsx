import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/lib/types/question-type";
import { useState } from "react";
import { useAnswerWriter } from "./useAnswerWriter";

export function SingleChoiceInput({
  question,
}: {
  question: Question<"single-choice">;
}) {
  const { clearAnswer, setAnswer } = useAnswerWriter();
  const [usingOther, setUsingOther] = useState(false);

  return (
    <div className="space-y-3">
      <RadioGroup
        onValueChange={(value) => {
          if (!question.config.options.includes(value)) {
            clearAnswer(question.id);
            return;
          }

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
            const otherAnswer = event.target.value.trim();
            setUsingOther(true);
            if (!otherAnswer) {
              clearAnswer(question.id);
              return;
            }

            setAnswer(question.id, {
              answer_type: "single-choice",
              config: { use_other: true, other_answer: otherAnswer },
            });
          }}
          className={usingOther ? "border-primary" : undefined}
        />
      ) : null}
    </div>
  );
}

export function MultipleChoiceInput({
  question,
}: {
  question: Question<"multiple-choice">;
}) {
  const { clearAnswer, setAnswer } = useAnswerWriter();
  const [selected, setSelected] = useState<string[]>([]);

  function updateSelected(option: string, checked: boolean) {
    if (!question.config.options.includes(option)) {
      return;
    }

    const next = checked
      ? [...selected, option]
      : selected.filter((value) => value !== option);
    setSelected(next);
    if (next.length === 0) {
      clearAnswer(question.id);
      return;
    }

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
          onChange={(event) => {
            const otherAnswer = event.target.value.trim();
            if (!otherAnswer) {
              clearAnswer(question.id);
              return;
            }

            setAnswer(question.id, {
              answer_type: "multiple-choice",
              config: { use_other: true, other_answer: otherAnswer },
            });
          }}
        />
      ) : null}
    </div>
  );
}

export function YesNoInput({ question }: { question: Question<"yes-no"> }) {
  const { clearAnswer, setAnswer } = useAnswerWriter();

  return (
    <RadioGroup
      onValueChange={(value) => {
        if (value !== "yes" && value !== "no") {
          clearAnswer(question.id);
          return;
        }

        setAnswer(question.id, {
          answer_type: "yes-no",
          config: { value: value === "yes" },
        });
      }}
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
