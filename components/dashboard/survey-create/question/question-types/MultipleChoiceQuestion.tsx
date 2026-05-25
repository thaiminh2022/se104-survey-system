"use client";

import { Switch } from "@/components/ui/switch";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { MultipleChoiceQuestionConfig } from "@/lib/types/question-type";
import { OptionListEditor } from "./OptionListEditor";

interface Props {
  sectionID: string;
  questionID: string;
}

export function MultipleChoiceQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as MultipleChoiceQuestionConfig;
  const options = config.options.length > 0 ? config.options : ["Option 1"];

  function updateConfig(nextConfig: MultipleChoiceQuestionConfig) {
    updateQuestionConfig(sectionID, questionID, nextConfig);
  }

  function updateOptions(nextOptions: string[]) {
    updateConfig({
      ...config,
      options: nextOptions,
    });
  }

  return (
    <div className="mt-4 space-y-3">
      <OptionListEditor options={options} onChange={updateOptions} />

      <div className="flex flex-wrap items-center gap-4 pl-10">
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={config.haveOther ?? false}
            onCheckedChange={(checked) =>
              updateConfig({
                ...config,
                haveOther: checked,
              })
            }
          />
          Allow other
        </label>
      </div>
    </div>
  );
}
