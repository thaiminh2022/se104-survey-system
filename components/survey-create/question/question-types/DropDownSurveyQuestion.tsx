"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { DropdownAnswerConfig } from "@/types/survey-create/question-type";
import { IconTrash, IconPlus, IconSelector } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

interface DropdownSurveyProps {
  sectionID: string;
  questionID: string;
}

export function DropdownSurveyQuestion({
  sectionID,
  questionID,
}: DropdownSurveyProps) {
  const updateQuestionConfig = useSurveyStore((s) => s.updateQuestionConfig);
  const latestOption = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);

  // Khởi tạo state cục bộ
  const [config, setConfig] = useState<DropdownAnswerConfig>({
    options: ["Option 1"],
    placeholder: "Select an option",
  });

  // Tự động focus vào ô input mới khi thêm option
  useEffect(() => {
    if (shouldFocus) {
      latestOption.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus, config.options]);

  const updateLocalOption = (idx: number, value: string) => {
    const nextOptions = [...config.options];
    nextOptions[idx] = value;
    const newConfig = { ...config, options: nextOptions };
    setConfig(newConfig);
    syncToStore(newConfig);
  };

  const addLocalOption = () => {
    setShouldFocus(true);
    setConfig((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeLocalOption = (idx: number) => {
    if (config.options.length <= 1) return;
    const nextOptions = config.options.filter((_, i) => i !== idx);
    const newConfig = { ...config, options: nextOptions };
    setConfig(newConfig);
    syncToStore(newConfig);
  };

  const syncToStore = (newConfig: DropdownAnswerConfig) => {
    // Loại bỏ các option trống trước khi lưu vào store
    const cleanOptions = newConfig.options.filter((opt) => opt.trim() !== "");
    updateQuestionConfig(sectionID, questionID, {
      ...newConfig,
      options: cleanOptions,
    });
  };

  return (
    <FieldGroup className="mt-4">
      <main className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
        <IconSelector size={16} /> Edit Options:
      </main>

      {/* Danh sách các input để sửa Option */}
      <div className="flex flex-col gap-2">
        {config.options.map((option, i) => (
          <Field orientation="horizontal" key={i} className="gap-2">
            <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
            <Input
              ref={i === config.options.length - 1 ? latestOption : undefined}
              value={option}
              placeholder={`Option ${i + 1}`}
              onChange={(e) => updateLocalOption(i, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeLocalOption(i)}
              disabled={config.options.length <= 1}
              className="text-muted-foreground hover:text-destructive"
            >
              <IconTrash size={18} />
            </Button>
          </Field>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addLocalOption}
        className="w-fit gap-2 border-dashed mt-1"
      >
        <IconPlus size={16} /> Add Option
      </Button>

      {/* Phần Preview để người tạo khảo sát thấy Dropdown thực tế trông ntn */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-dashed">
        <FieldLabel className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 block">
          Live Preview:
        </FieldLabel>
        <Select disabled>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder={config.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((opt, i) => (
              <SelectItem key={i} value={opt || `empty-${i}`}>
                {opt || `Option ${i + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FieldGroup>
  );
}