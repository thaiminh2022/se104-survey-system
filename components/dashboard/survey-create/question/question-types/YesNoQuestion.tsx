"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { YesNoQuestionConfig } from "@/lib/types/question-type";

interface Props {
  sectionID: string;
  questionID: string;
}

export function YesNoQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as YesNoQuestionConfig;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field>
        <FieldLabel>Yes label</FieldLabel>
        <Input
          value={config.yesLabel ?? ""}
          placeholder="Yes"
          onChange={(event) =>
            updateQuestionConfig(sectionID, questionID, {
              ...config,
              yesLabel: event.target.value,
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel>No label</FieldLabel>
        <Input
          value={config.noLabel ?? ""}
          placeholder="No"
          onChange={(event) =>
            updateQuestionConfig(sectionID, questionID, {
              ...config,
              noLabel: event.target.value,
            })
          }
        />
      </Field>
    </div>
  );
}
