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
  "short-answer": ShortQuestionConfig;
  "long-answer": LongQuestionConfig;
  "multiple-choice": MultipleChoiceQuestionConfig;
  "checkbox": CheckBoxQuestionConfig;
  "dropdown": DropdownQuestionConfig;
  "datetime": DatetimeQuestionConfig;
  "number": NumberQuestionConfig;
  "rating": RatingQuestionConfig;
};

export type ShortQuestionConfig = {
  placeholder?: string;
};
export type LongQuestionConfig = {
  placeholder?: string;
};

export type MultipleChoiceQuestionConfig = {
  options: string[];
  haveOther?: boolean;
};

export type DropdownQuestionConfig = {};
export type RatingQuestionConfig = {};

export type NumberQuestionConfig = {
  isInteger: boolean;
  isRange: boolean;
  min: number;
  max: number;
};

export type DatetimeQuestionConfig = {
  mode: DateTimeMode;
};
export type DateTimeMode = "date" | "time" | "datetime";

export type CheckBoxQuestionConfig = {
  haveOther: boolean;
  options: string[];
};
