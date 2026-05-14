"use client";

import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { RankingQuestionConfig } from "@/types/question-type";
import { OptionListEditor } from "./OptionListEditor";

interface Props {
  sectionID: string;
  questionID: string;
}

export function RankingQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as RankingQuestionConfig;

  return (
    <OptionListEditor
      label="Rank item"
      options={config.options}
      onChange={(options) =>
        updateQuestionConfig(sectionID, questionID, { ...config, options })
      }
    />
  );
}
