"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Answer, AnswerForm } from "@/types/answer-type";
import type { Survey } from "@/types/question-type";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SurveyResponseSection } from "./SurveyResponseSection";

type Props = {
  survey: Survey;
};

export default function SurveyResponseForm({ survey }: Props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const answerForm = useForm<AnswerForm>({
    defaultValues: {
      answers: {},
    },
  });

  if (survey.sections.length === 0) {
    return (
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>No sections available</CardTitle>
          <CardDescription>
            This survey does not have any sections yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (false) {
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

  const section = survey.sections[sectionIndex];
  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === survey.sections.length - 1;
  const values = answerForm.watch("answers");

  const missingRequired = section.questions.some((question) => {
    const answer = values?.[question.id];

    return question.required && !hasEnteredValue(answer);
  });

  function goBack() {
    setSectionIndex((current) => current - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    setSectionIndex((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onSubmit(data: AnswerForm) {
    console.log(data);
  }

  return (
    <FormProvider {...answerForm}>
      <form
        onSubmit={answerForm.handleSubmit(onSubmit)}
        className="mt-5 space-y-5 pb-10"
      >
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            Section {sectionIndex + 1} of {survey.sections.length}
          </span>
          <span>{section.questions.length} questions</span>
        </div>

        <SurveyResponseSection section={section} />

        <Card>
          <CardFooter className="justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isFirstSection}
              onClick={goBack}
            >
              <IconArrowLeft />
              Back
            </Button>
            {isLastSection ? (
              <Button type="submit" disabled={missingRequired}>
                <IconCheck />
                Submit
              </Button>
            ) : (
              <Button type="button" disabled={missingRequired} onClick={goNext}>
                Next
                <IconArrowRight />
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
function hasEnteredValue(answer: Answer | undefined) {
  if (answer == undefined) {
    return false;
  }

  switch (answer.answer_type) {
    case "number":
      return true;
    case "short-answer":
      return answer.config.answer.trim() != "";
    case "long-answer":
      return answer.config.answer.trim() != "";
    case "multiple-choice":
      if (answer.config.use_other) {
        return answer.config.other_answer.trim() != "";
      } else {
        return answer.config.selected_option.trim() != "";
      }
    case "checkbox":
      if (answer.config.use_other) {
        return answer.config.other_answer.trim() != "";
      } else {
        return answer.config.selected_options.length > 0;
      }
    case "dropdown":
      return answer.config.selected_option.trim() != "";
    case "datetime":
      return true;
    case "rating":
      return true;
  }
}
