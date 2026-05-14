"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { RatingScaleQuestionConfig } from "@/types/question-type";

interface Props {
  sectionID: string;
  questionID: string;
}

export function RatingScaleQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as RatingScaleQuestionConfig;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field>
        <FieldLabel>0 label</FieldLabel>
        <Input
          value={config.minLabel ?? ""}
          placeholder="Low"
          onChange={(event) =>
            updateQuestionConfig(sectionID, questionID, {
              ...config,
              minLabel: event.target.value,
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>5 label</FieldLabel>
        <Input
          value={config.maxLabel ?? ""}
          placeholder="High"
          onChange={(event) =>
            updateQuestionConfig(sectionID, questionID, {
              ...config,
              maxLabel: event.target.value,
            })
          }
        />
      </Field>
    </div>
  );
}
