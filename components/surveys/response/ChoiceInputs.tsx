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
  const [selectedOption, setSelectedOption] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [usingOther, setUsingOther] = useState(false);

  function commitOption(value: string) {
    if (!question.config.options.includes(value)) {
      clearAnswer(question.id);
      return;
    }

    setSelectedOption(value);
    setOtherValue("");
    setUsingOther(false);
    setAnswer(question.id, {
      answer_type: "single-choice",
      config: { use_other: false, selected_option: value },
    });
  }

  function commitOther(value: string) {
    const otherAnswer = value.trim();
    setOtherValue(value);
    setSelectedOption("");
    setUsingOther(otherAnswer.length > 0);

    if (!otherAnswer) {
      clearAnswer(question.id);
      return;
    }

    setAnswer(question.id, {
      answer_type: "single-choice",
      config: { use_other: true, other_answer: otherAnswer },
    });
  }

  return (
    <div className="space-y-3">
      <RadioGroup value={selectedOption} onValueChange={commitOption}>
        {question.config.options.map((option, index) => {
          const identifier = `${question.id}-${option}-${index}`;
          return (
            <div
              className="flex items-center gap-3"
              key={identifier}
              onPointerDown={() => commitOption(option)}
            >
              <RadioGroupItem
                value={option}
                id={identifier}
                onPointerDown={() => commitOption(option)}
                onClick={() => commitOption(option)}
              />
              <Label htmlFor={identifier}>{option}</Label>
            </div>
          );
        })}
      </RadioGroup>
      {question.config.haveOther ? (
        <Input
          type="text"
          placeholder="Other"
          value={otherValue}
          onFocus={() => setUsingOther(otherValue.trim().length > 0)}
          onChange={(event) => commitOther(event.target.value)}
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
  const [otherValue, setOtherValue] = useState("");
  const [usingOther, setUsingOther] = useState(false);

  function updateSelected(option: string, checked: boolean) {
    if (!question.config.options.includes(option)) {
      return;
    }

    setOtherValue("");
    setUsingOther(false);
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

  function commitOther(value: string) {
    const otherAnswer = value.trim();
    setOtherValue(value);
    setSelected([]);
    setUsingOther(otherAnswer.length > 0);

    if (!otherAnswer) {
      clearAnswer(question.id);
      return;
    }

    setAnswer(question.id, {
      answer_type: "multiple-choice",
      config: { use_other: true, other_answer: otherAnswer },
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
          value={otherValue}
          onChange={(event) => commitOther(event.target.value)}
          className={usingOther ? "border-primary" : undefined}
        />
      ) : null}
    </div>
  );
}

export function YesNoInput({ question }: { question: Question<"yes-no"> }) {
  const { clearAnswer, setAnswer } = useAnswerWriter();

  function commitValue(value: string) {
    if (value !== "yes" && value !== "no") {
      clearAnswer(question.id);
      return;
    }

    setAnswer(question.id, {
      answer_type: "yes-no",
      config: { value: value === "yes" },
    });
  }

  return (
    <RadioGroup onValueChange={commitValue}>
      <div
        className="flex items-center gap-3"
        onPointerDown={() => commitValue("yes")}
      >
        <RadioGroupItem
          value="yes"
          id={`${question.id}-yes`}
          onPointerDown={() => commitValue("yes")}
          onClick={() => commitValue("yes")}
        />
        <Label htmlFor={`${question.id}-yes`}>
          {question.config.yesLabel ?? "Yes"}
        </Label>
      </div>
      <div
        className="flex items-center gap-3"
        onPointerDown={() => commitValue("no")}
      >
        <RadioGroupItem
          value="no"
          id={`${question.id}-no`}
          onPointerDown={() => commitValue("no")}
          onClick={() => commitValue("no")}
        />
        <Label htmlFor={`${question.id}-no`}>
          {question.config.noLabel ?? "No"}
        </Label>
      </div>
    </RadioGroup>
  );
}
