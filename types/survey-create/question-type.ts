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
  | ShortAnswerConfig
  | MultipleChoiceConfig
  | CheckBoxConfig;

export type ShortAnswerConfig = {};
export type MultipleChoiceConfig = {};

export type CheckBoxConfig = {
  haveOther: boolean;
  options: string[];
};
