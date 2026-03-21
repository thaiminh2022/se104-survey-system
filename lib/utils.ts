import { QuestionTypes } from "@/types/survey-create/question-type";
import { clsx, type ClassValue } from "clsx";
import { SwitchCamera } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertQuestionTypeToName(t: QuestionTypes) {
  switch (t) {
    case "number":
      return "Number";
    case "short-answer":
      return "Short Answer";
    case "long-answer":
      return "Long Answer";
    case "multiple-choice":
      return "Multiple Choice";
    case "checkbox":
      return "Checkbox";
    case "dropdown":
      return "Drop down";
    case "datetime":
      return "Date Time";
    case "rating":
      return "Rating";
  }
}
