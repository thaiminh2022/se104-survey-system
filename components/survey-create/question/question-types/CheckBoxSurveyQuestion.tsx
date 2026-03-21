import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { CheckBoxConfig } from "@/types/survey-create/question-type";
import { IconCheckbox, IconTrash } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";

interface CheckboxSurveyProps {
  sIndex: number;
  qIndex: number;
}

export function CheckBoxSurveyQuestion({
  sIndex,
  qIndex,
}: CheckboxSurveyProps) {
  const updateQuestionConfig = useSurveyStore((s) => s.updateQuestionConfig);
  const latestOption = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [config, setConfig] = useState<CheckBoxConfig>({
    haveOther: false,
    options: [],
  });

  useEffect(() => {
    if (shouldFocus) {
      latestOption.current?.focus();
      setShouldFocus(false); // Reset the flag
    }
  }, [shouldFocus, config.options]);

  function updateLocalOption(idx: number, value: string) {
    const next = [...config.options];
    next[idx] = value;

    const newConfig = {
      ...config,
      options: next,
    };
    setConfig(newConfig);
    updateConfig(newConfig);
  }

  function addLocalOption() {
    setShouldFocus(true); // Set the flag
    setConfig((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  }

  function removeLocalOption(idx: number) {
    if (config.options.length == 1) {
      return;
    }

    const next = [...config.options];
    next.splice(idx, 1);

    const newConfig = {
      ...config,
      options: next,
    };
    setConfig(newConfig);
    updateConfig(newConfig);
  }

  function updateConfig(newConfig: CheckBoxConfig) {
    const cleanOption = newConfig.options.filter((e) => e.trim() != "");
    const sendConfig: CheckBoxConfig = {
      ...newConfig,
      options: cleanOption,
    };
    updateQuestionConfig(sIndex, qIndex, sendConfig);
  }

  return (
    <>
      <main>Options:</main>
      {config.options.map((v, i) => {
        const idx = i;
        return (
          <Field orientation="horizontal" key={i}>
            <IconCheckbox />
            <Input
              key={i}
              value={v}
              onChange={(e) => {
                updateLocalOption(idx, e.target.value);
              }}
              ref={idx == config.options.length - 1 ? latestOption : undefined}
            />
            <Button type="button" onClick={() => removeLocalOption(idx)}>
              <IconTrash />
            </Button>
          </Field>
        );
      })}
      {!config.haveOther ? null : (
        <Field orientation="horizontal">
          <IconCheckbox />
          <Input readOnly disabled value={"Other: "} />
          <Button
            type="button"
            onClick={() => {
              const newConfig = {
                ...config,
                haveOther: false,
              };
              setConfig(newConfig);
              updateConfig(newConfig);
            }}
          >
            <IconTrash />
          </Button>
        </Field>
      )}
      <Field orientation="horizontal">
        <Input
          readOnly
          placeholder="Add more"
          onClick={(e) => {
            addLocalOption();
          }}
        />
        <Button
          disabled={config.haveOther}
          onClick={() => {
            const newConfig = {
              ...config,
              haveOther: true,
            };
            setConfig(newConfig);
            updateConfig(newConfig);
          }}
        >
          Add other
        </Button>
      </Field>
    </>
  );
}
