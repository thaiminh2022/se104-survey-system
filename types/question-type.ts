export const QUESTION_TYPES = [
  "short-answer",
  "long-answer",
  "multiple-choice",
  "checkbox",
  "dropdown",
  "datetime",
  "number",
  "rating",
] as const;

export type QuestionTypes = (typeof QUESTION_TYPES)[number];

export type Survey = {
  title: string;
  description: string;
  sections: Section[];
};

export type Section = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

export type Question = {
  id: string;
  title: string;
  description: string;
  question_type: QuestionTypes;
  config: QuestionConfig;
  required: boolean;
};

export type QuestionConfig =
  | ShortAnswerConfig
  | LongAnswerConfig
  | MultipleChoiceConfig
  | CheckBoxConfig
  | DropdownAnswerConfig
  | NumberAnswerConfig
  | DatetimeAnswerConfig
  | RatingConfig;

export type ShortAnswerConfig = {
  placeholder?: string;
};

export type MultipleChoiceConfig = {
  options: string[];
  haveOther?: boolean;
};

export type LongAnswerConfig = {
  placeholder?: string;
};
export type DropdownAnswerConfig = {};
export type RatingConfig = {};

export type NumberAnswerConfig = {
  isInteger: boolean;
  isRange: boolean;
  min: number;
  max: number;
};

export type DatetimeAnswerConfig = {
  date: Date;
  mode: DateTimeMode;
};
export type DateTimeMode = "date" | "time" | "datetime";

export type CheckBoxConfig = {
  haveOther: boolean;
  options: string[];
};
