"use client";

import { useSurveyStore } from "@/lib/stores/survey_store";
import { DropdownQuestionConfig } from "@/lib/types/question-type";
import { OptionListEditor } from "./OptionListEditor";

interface Props {
  sectionID: string;
  questionID: string;
}

export function DropdownQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as DropdownQuestionConfig;

  return (
    <OptionListEditor
      options={config.options}
      onChange={(options) =>
        updateQuestionConfig(sectionID, questionID, { ...config, options })
      }
    />
  );
}
