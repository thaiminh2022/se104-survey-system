"use client";

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
import { RatingConfig } from "@/types/survey-create/question-type";
import { IconStar, IconStarFilled, IconSettings } from "@tabler/icons-react";
import { useState, useEffect } from "react";

interface RatingSurveyProps {
  sectionID: string;
  questionID: string;
}

export function RatingSurveyQuestion({ sectionID, questionID }: RatingSurveyProps) {
  const updateQuestionConfig = useSurveyStore((s) => s.updateQuestionConfig);

  const [config, setConfig] = useState<RatingConfig>({
    maxRating: 5,
    shape: "star",
    minLabel: "Poor",
    maxLabel: "Excellent",
  });

  useEffect(() => {
    updateQuestionConfig(sectionID, questionID, config);
  }, [config, sectionID, questionID, updateQuestionConfig]);

  const updateConfig = (key: keyof RatingConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <FieldGroup className="mt-4 gap-4">
      <main className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
        <IconSettings size={18} /> Rating Settings:
      </main>

      <div className="grid grid-cols-2 gap-4">
        {/* Chọn số lượng mức đánh giá */}
        <Field>
          <FieldLabel>Levels (1 to X):</FieldLabel>
          <Select 
            value={config.maxRating.toString()} 
            onValueChange={(v) => updateConfig("maxRating", parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[3, 4, 5, 6, 7, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num} Levels</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Chọn kiểu icon */}
        <Field>
          <FieldLabel>Shape:</FieldLabel>
          <Select 
            value={config.shape} 
            onValueChange={(v) => updateConfig("shape", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="star">Stars</SelectItem>
              <SelectItem value="number">Numbers</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* Nhãn cho các đầu mút */}
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Min Label (Optional):</FieldLabel>
          <Input 
            value={config.minLabel} 
            placeholder="e.g. Bad" 
            onChange={(e) => updateConfig("minLabel", e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Max Label (Optional):</FieldLabel>
          <Input 
            value={config.maxLabel} 
            placeholder="e.g. Good" 
            onChange={(e) => updateConfig("maxLabel", e.target.value)}
          />
        </Field>
      </div>

      {/* Live Preview */}
      <div className="mt-6 p-6 rounded-xl bg-muted/20 border border-dashed text-center">
        <FieldLabel className="text-[10px] uppercase font-bold text-muted-foreground mb-4 block">
          Live Preview:
        </FieldLabel>
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: config.maxRating }).map((_, i) => (
              <div key={i} className="text-yellow-500 cursor-default">
                {config.shape === "star" && <IconStar size={28} />}
                {config.shape === "heart" && <IconStar size={28} />} {/* Có thể thay bằng IconHeart */}
                {config.shape === "number" && (
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {(config.minLabel || config.maxLabel) && (
            <div className="flex justify-between w-full max-w-[250px] mt-2 px-1 text-xs text-muted-foreground italic">
              <span>{config.minLabel}</span>
              <span>{config.maxLabel}</span>
            </div>
          )}
        </div>
      </div>
    </FieldGroup>
  );
}