"use client";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { NumberQuestionConfig } from "@/types/question-type";
import { useEffect, useState } from "react";

interface NumberSurveyQuestionProps {
  questionID: string;
  sectionID: string;
}

export function NumberSurveyQuestion({
  questionID,
  sectionID,
}: NumberSurveyQuestionProps) {
  const [isInteger, setIsInteger] = useState(true);
  const [isRange, setIsRange] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  const updateQuestionConfig = useSurveyStore((s) => s.updateQuestionConfig);

  useEffect(() => {
    const c: NumberQuestionConfig = {
      isInteger,
      isRange,
      min,
      max,
    };
    updateQuestionConfig(sectionID, questionID, c);
  }, [isInteger, isRange, min, max]);

  return (
    <FieldGroup>
      <FieldSet>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="isRange-input">Range</FieldLabel>
          <Switch
            id="isRange-input"
            checked={isRange}
            onCheckedChange={(e) => {
              setIsRange(e);
            }}
          />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="isInteger-input">Integer</FieldLabel>
          <Switch
            id="isInteger-input"
            checked={isInteger}
            onCheckedChange={(e) => {
              setIsInteger(e);
            }}
          />
        </Field>
      </FieldSet>
      <FieldSet hidden={!isRange}>
        <Field orientation="horizontal" className="w-44">
          <FieldLabel htmlFor="min-input">Min</FieldLabel>
          <Input
            id="min-input"
            type="number"
            value={min}
            onChange={(e) => {
              const n = e.target.valueAsNumber;
              if (Number.isNaN(n)) {
                return;
              }
              setMin(n);
            }}
          />
        </Field>
        <Field orientation="horizontal" className="w-44">
          <FieldLabel htmlFor="max-input">Max</FieldLabel>
          <Input
            id="max-input"
            type="num  ber"
            value={max}
            onChange={(e) => {
              const n = e.target.valueAsNumber;
              if (Number.isNaN(n)) {
                return;
              }
              setMax(n);
            }}
          />
        </Field>
      </FieldSet>
    </FieldGroup>
  );
}
