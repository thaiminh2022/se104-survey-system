"use client";

import { useState } from "react";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  MultipleChoiceQuestionConfig,
  NumberQuestionConfig,
  Question,
  Survey,
} from "@/types/question-type";

type AnswerValue = string | string[] | number | null;
type Answers = Record<string, AnswerValue>;

type Props = {
  survey: Survey;
};

export default function SurveyResponseForm({ survey }: Props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const section = survey.sections[sectionIndex];

  if (survey.sections.length === 0) {
    return (
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>No sections available</CardTitle>
          <CardDescription>This survey does not have any sections yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === survey.sections.length - 1;

  const requiredQuestionIds = section.questions
    .filter((q) => q.required)
    .map((q) => q.id);

  const missingRequired = requiredQuestionIds.some((id) => {
    const value = answers[id];
    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    );
  });

  function updateAnswer(questionId: string, value: AnswerValue) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function goNext() {
    if (!isLastSection) {
      setSectionIndex((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Response submitted</CardTitle>
          <CardDescription>
            Thank you for completing {survey.title}.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mt-5 space-y-5 pb-10">
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Section {sectionIndex + 1} of {survey.sections.length}
        </span>
        <span>{section.questions.length} questions</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
          {section.description ? (
            <CardDescription>{section.description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-6">
          {section.questions.map((question, index) => (
            <QuestionField
              key={question.id}
              answer={answers[question.id]}
              index={index}
              question={question}
              onChange={(value) => updateAnswer(question.id, value)}
            />
          ))}
        </CardContent>
        <CardFooter className="justify-between gap-3 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={isFirstSection}
            onClick={() => {
              setSectionIndex((current) => current - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <IconArrowLeft />
            Back
          </Button>
          <Button type="button" disabled={missingRequired} onClick={goNext}>
            {isLastSection ? (
              <>
                <IconCheck />
                Submit
              </>
            ) : (
              <>
                Next
                <IconArrowRight />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function QuestionField({
  answer,
  index,
  question,
  onChange,
}: {
  answer: AnswerValue | undefined;
  index: number;
  question: Question;
  onChange: (value: AnswerValue) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 p-4">
      <div className="space-y-1">
        <Label className="text-base font-medium">
          {index + 1}. {question.title}
          {question.required ? <span className="text-destructive"> *</span> : null}
        </Label>
        {question.description ? (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        ) : null}
      </div>
      <QuestionInput question={question} answer={answer} onChange={onChange} />
    </div>
  );
}

function QuestionInput({
  answer,
  question,
  onChange,
}: {
  answer: AnswerValue | undefined;
  question: Question;
  onChange: (value: AnswerValue) => void;
}) {
  switch (question.question_type) {
    case "short-answer":
      return (
        <Input
          value={typeof answer === "string" ? answer : ""}
          placeholder="Your answer"
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "long-answer":
      return (
        <Textarea
          value={typeof answer === "string" ? answer : ""}
          placeholder="Your answer"
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "multiple-choice":
      return (
        <OptionList
          config={question.config as MultipleChoiceQuestionConfig}
          value={typeof answer === "string" ? answer : ""}
          onChange={onChange}
        />
      );
    case "checkbox":
      return (
        <CheckboxList
          config={question.config as CheckBoxQuestionConfig}
          value={Array.isArray(answer) ? answer : []}
          onChange={onChange}
        />
      );
    case "dropdown":
      return (
        <Select
          value={typeof answer === "string" ? answer : ""}
          onValueChange={(value) => onChange(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option-1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
    case "datetime":
      return (
        <Input
          type="datetime-local"
          value={typeof answer === "string" ? answer : ""}
          onChange={(event) => onChange(event.target.value)}
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
          value={typeof answer === "number" ? answer : ""}
          onChange={(event) =>
            onChange(event.target.value === "" ? null : Number(event.target.value))
          }
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
              variant={answer === String(rating) ? "default" : "outline"}
              size="icon"
              onClick={() => onChange(String(rating))}
              aria-label={`Rate ${rating}`}
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
  value,
  onChange,
}: {
  config: MultipleChoiceQuestionConfig;
  value: string;
  onChange: (value: AnswerValue) => void;
}) {
  const options = config.options.length > 0 ? config.options : ["Option 1"];

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-3 text-sm">
          <input
            type="radio"
            className="size-4 accent-primary"
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <span>{option}</span>
        </label>
      ))}
      {config.haveOther ? (
        <Input
          value={value && !options.includes(value) ? value : ""}
          placeholder="Other"
          onChange={(event) => onChange(event.target.value)}
        />
      ) : null}
    </div>
  );
}

function CheckboxList({
  config,
  value,
  onChange,
}: {
  config: CheckBoxQuestionConfig;
  value: string[];
  onChange: (value: AnswerValue) => void;
}) {
  const options = config.options.length > 0 ? config.options : ["Option 1"];

  function toggleOption(option: string, checked: boolean) {
    if (checked) {
      onChange([...value, option]);
      return;
    }

    onChange(value.filter((item) => item !== option));
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-3 text-sm">
          <Checkbox
            checked={value.includes(option)}
            onCheckedChange={(checked) => toggleOption(option, checked === true)}
          />
          <span>{option}</span>
        </label>
      ))}
      {config.haveOther ? (
        <Input
          placeholder="Other"
          onChange={(event) => {
            const otherValue = event.target.value;
            onChange([
              ...value.filter((item) => options.includes(item)),
              ...(otherValue ? [otherValue] : []),
            ]);
          }}
        />
      ) : null}
    </div>
  );
}
