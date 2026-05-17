"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimeMode, DateTimeQuestionConfig } from "@/lib/types/question-type";
import { useEffect, useState } from "react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useSurveyStore } from "@/lib/stores/survey_store";

interface DateTimeQuestionProps {
  questionID: string;
  sectionID: string;
}

export default function DateTimeQuestion({
  sectionID,
  questionID,
}: DateTimeQuestionProps) {
  const [mode, setMode] = useState<DateTimeMode>("date");

  const updateQuestionConfig = useSurveyStore((s) => s.updateQuestionConfig);

  useEffect(() => {
    const config: DateTimeQuestionConfig = {
      mode,
    };
    updateQuestionConfig(sectionID, questionID, config);
  }, [mode, sectionID, questionID, updateQuestionConfig]);

  return (
    <FieldGroup>
      <Field orientation="horizontal" className="w-44">
        <FieldLabel>Type:</FieldLabel>
        <Select value={mode} onValueChange={(e) => setMode(e as DateTimeMode)}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="datetime">Datetime</SelectItem>
              <SelectItem value="time">Time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
