"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { ConsentQuestionConfig } from "@/types/question-type";

interface Props {
  sectionID: string;
  questionID: string;
}

export function ConsentQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as ConsentQuestionConfig;

  return (
    <Field>
      <FieldLabel>Agreement text</FieldLabel>
      <Textarea
        value={config.label}
        placeholder="I agree to the terms above."
        onChange={(event) =>
          updateQuestionConfig(sectionID, questionID, {
            ...config,
            label: event.target.value,
          })
        }
      />
    </Field>
  );
}
