"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fakeSubmitSurveyResponse,
  submitSurveyResponse,
} from "@/lib/actions/submit_survey_response";
import { Answer, AnswerForm } from "@/lib/types/answer-type";
import type { Survey } from "@/lib/types/question-type";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SurveyResponseSection } from "./SurveyResponseSection";
import { AnswerWriterSyncProvider } from "./response/useAnswerWriter";

type Props = {
  survey: Survey;
};

export default function SurveyResponseForm({ survey }: Props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerForm["answers"]>({});

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

  if (submitted || answerForm.formState.isSubmitSuccessful) {
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

  const missingRequiredQuestionIds = getMissingRequiredQuestionIds(
    section,
    answers,
  );
  const missingRequired = missingRequiredQuestionIds.length > 0;

  function setSyncedAnswer(questionId: string, answer: Answer) {
    setAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  }

  function clearSyncedAnswer(questionId: string) {
    setAnswers((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  }

  function goBack() {
    setSectionIndex((current) => current - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    if (hasMissingRequiredAnswers(section, answers)) {
      return;
    }

    setSectionIndex((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(data: AnswerForm) {
    const formData = {
      ...data,
      answers,
    };
    const result =
      survey.id == "test"
        ? await fakeSubmitSurveyResponse(survey.id, formData)
        : await submitSurveyResponse(survey.id, formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      answerForm.setError("root", {
        message: result.message,
      });
      toast.error("Error when submitting form: " + result.message);
    }
  }

  return (
    <FormProvider {...answerForm}>
      <AnswerWriterSyncProvider
        value={{
          setSyncedAnswer,
          clearSyncedAnswer,
        }}
      >
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
            <CardContent>
              {answerForm.formState.errors.root?.message ? (
                <p className="text-sm text-destructive">
                  {answerForm.formState.errors.root.message}
                </p>
              ) : null}
            </CardContent>
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
                <Button
                  type="submit"
                  disabled={missingRequired || answerForm.formState.isSubmitting}
                  data-missing-required={missingRequiredQuestionIds.join(",")}
                >
                  <IconCheck />
                  {answerForm.formState.isSubmitting
                    ? "Submitting..."
                    : "Submit"}
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={missingRequired}
                  data-missing-required={missingRequiredQuestionIds.join(",")}
                  onClick={goNext}
                >
                  Next
                  <IconArrowRight />
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </AnswerWriterSyncProvider>
    </FormProvider>
  );
}

function hasMissingRequiredAnswers(
  section: Survey["sections"][number],
  answers: AnswerForm["answers"] | undefined,
) {
  return getMissingRequiredQuestionIds(section, answers).length > 0;
}

function getMissingRequiredQuestionIds(
  section: Survey["sections"][number],
  answers: AnswerForm["answers"] | undefined,
) {
  return section.questions.flatMap((question) => {
    const answer = answers?.[question.id];

    return question.required && !hasEnteredValue(answer) ? [question.id] : [];
  });
}

function hasEnteredValue(answer: Answer | undefined) {
  if (answer == undefined) {
    return false;
  }

  switch (answer.answer_type) {
    case "single-choice":
      if (answer.config.use_other) {
        return answer.config.other_answer.trim() != "";
      }
      return answer.config.selected_option.trim() != "";
    case "multiple-choice":
      if (answer.config.use_other) {
        return answer.config.other_answer.trim() != "";
      }
      return answer.config.selected_options.length > 0;
    case "rating-scale":
      return answer.config.rating >= 0 && answer.config.rating <= 5;
    case "likert-scale":
      return answer.config.selected_option.trim() != "";
    case "short-text":
      return answer.config.text.trim() != "";
    case "long-text":
      return answer.config.text.trim() != "";
    case "dropdown":
      return answer.config.selected_option.trim() != "";
    case "yes-no":
      return typeof answer.config.value === "boolean";
    case "matrix":
      return Object.values(answer.config.rows).some((value) =>
        Array.isArray(value) ? value.length > 0 : value.trim() != "",
      );
    case "ranking":
      return answer.config.ranked_options.length > 0;
    case "date-time":
      return answer.config.value.trim() != "";
    case "consent":
      return answer.config.accepted;
    case "number":
      return true;
  }
}
