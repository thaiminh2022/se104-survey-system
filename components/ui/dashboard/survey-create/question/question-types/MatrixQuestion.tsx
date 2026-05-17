"use client";

import { Switch } from "@/components/ui/switch";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { MatrixQuestionConfig } from "@/lib/types/question-type";
import { OptionListEditor } from "./OptionListEditor";

interface Props {
  sectionID: string;
  questionID: string;
}

export function MatrixQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as MatrixQuestionConfig;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Rows</p>
          <OptionListEditor
            label="Row"
            options={config.rows}
            onChange={(rows) =>
              updateQuestionConfig(sectionID, questionID, { ...config, rows })
            }
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Columns</p>
          <OptionListEditor
            label="Column"
            options={config.columns}
            onChange={(columns) =>
              updateQuestionConfig(sectionID, questionID, {
                ...config,
                columns,
              })
            }
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch
          checked={config.multiplePerRow ?? false}
          onCheckedChange={(multiplePerRow) =>
            updateQuestionConfig(sectionID, questionID, {
              ...config,
              multiplePerRow,
            })
          }
        />
        Allow multiple answers per row
      </label>
    </div>
  );
}
