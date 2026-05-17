"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { SingleChoiceQuestionConfig } from "@/lib/types/question-type";
import { IconCircle, IconX } from "@tabler/icons-react";

interface Props {
  sectionID: string;
  questionID: string;
}

export function SingleChoiceQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore(
    (state) => state.updateQuestionConfig,
  );
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  if (!question) return null;

  const config = question.config as SingleChoiceQuestionConfig;
  const options = config.options.length > 0 ? config.options : ["Option 1"];

  function updateOptions(nextOptions: string[]) {
    updateQuestionConfig(sectionID, questionID, {
      ...config,
      options: nextOptions,
    });
  }

  return (
    <div className="mt-4 space-y-3">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-3">
          <IconCircle className="size-5 text-muted-foreground" />
          <Input
            value={option}
            onChange={(event) => {
              const nextOptions = [...options];
              nextOptions[index] = event.target.value;
              updateOptions(nextOptions);
            }}
            placeholder={`Option ${index + 1}`}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={options.length <= 1}
            onClick={() => updateOptions(options.filter((_, i) => i !== index))}
          >
            <IconX className="size-4" />
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-4 pl-8">
        <Button
          type="button"
          variant="link"
          className="h-auto p-0"
          onClick={() => updateOptions([...options, `Option ${options.length + 1}`])}
        >
          Add option
        </Button>
        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={config.haveOther ?? false}
            onCheckedChange={(checked) =>
              updateQuestionConfig(sectionID, questionID, {
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
