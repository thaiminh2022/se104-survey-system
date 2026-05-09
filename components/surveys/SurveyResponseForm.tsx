"use client";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useActionState, useState } from "react";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";
import {
  fakeSubmitSurveyResponse,
  submitSurveyResponse,
} from "@/lib/actions/submit_survey_response";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Survey } from "@/types/question-type";
import { SurveyResponseSection } from "./response/SurveyResponseSection";
import type { Answers, AnswerValue } from "./response/types";
import { AnswerForm } from "@/types/answer-type";

type Props = {
  survey: Survey;
};

export default function SurveyResponseForm({ survey }: Props) {
  const [sectionIndex, setSectionIndex] = useState(0);

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
  const missingRequired = section.questions.some((question) => {
    // if (!question.required) {
    //   return false;
    // }

    // return isEmptyAnswer(answers[question.id]);
    return true; // TODO: implement required question validation
  });

  function goBack() {
    setSectionIndex((current) => current - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    setSectionIndex((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const answerForm = useForm<AnswerForm>({
    defaultValues: {
      answers: {},
    },
  });

  function onSubmit(data: AnswerForm) {}

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
