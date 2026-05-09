import { SurveyStatus } from "./db_schema";

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
  state: SurveyStatus;
};

export type Section = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

export type Question<TType extends QuestionTypes = QuestionTypes> = {
  [K in TType]: {
    id: string;
    title: string;
    description: string;
    question_type: K;
    config: QuestionConfigByType[K];
    required: boolean;
  };
}[TType];


export type QuestionConfigByType = {
  "short-answer": ShortAnswerConfig;
  "long-answer": LongAnswerConfig;
  "multiple-choice": MultipleChoiceConfig;
  "checkbox": CheckBoxConfig;
  "dropdown": DropdownAnswerConfig;
  "datetime": DatetimeAnswerConfig;
  "number": NumberAnswerConfig;
  "rating": RatingConfig;
};

export type ShortAnswerConfig = {
  placeholder?: string;
};
export type LongAnswerConfig = {
  placeholder?: string;
};

export type MultipleChoiceConfig = {
  options: string[];
  haveOther?: boolean;
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
  mode: DateTimeMode;
};
export type DateTimeMode = "date" | "time" | "datetime";

export type CheckBoxConfig = {
  haveOther: boolean;
  options: string[];
};
