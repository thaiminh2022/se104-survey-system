import { SurveyStatus } from "./db_schema";

export const QUESTION_TYPES = [
  "single-choice",
  "multiple-choice",
  "rating-scale",
  "likert-scale",
  "short-text",
  "long-text",
  "dropdown",
  "yes-no",
  "matrix",
  "ranking",
  "date-time",
  "consent",
  "number",
] as const;

export type QuestionTypes = (typeof QUESTION_TYPES)[number];

export type Survey = {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  state: SurveyStatus;
  allowedRespondentEmails?: string[];
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
  "single-choice": SingleChoiceQuestionConfig;
  "multiple-choice": MultipleChoiceQuestionConfig;
  "rating-scale": RatingScaleQuestionConfig;
  "likert-scale": LikertScaleQuestionConfig;
  "short-text": ShortTextQuestionConfig;
  "long-text": LongTextQuestionConfig;
  "dropdown": DropdownQuestionConfig;
  "yes-no": YesNoQuestionConfig;
  "matrix": MatrixQuestionConfig;
  "ranking": RankingQuestionConfig;
  "date-time": DateTimeQuestionConfig;
  consent: ConsentQuestionConfig;
  "number": NumberQuestionConfig;
};

export type SingleChoiceQuestionConfig = {
  options: string[];
  haveOther?: boolean;
};

export type MultipleChoiceQuestionConfig = {
  options: string[];
  haveOther?: boolean;
  minSelected?: number;
  maxSelected?: number;
};

export type RatingScaleQuestionConfig = {
  min: 0;
  max: 5;
  minLabel?: string;
  maxLabel?: string;
};

export type LikertScaleQuestionConfig = {
  options: string[];
};

export type ShortTextQuestionConfig = {
  placeholder?: string;
  maxLength?: number;
};

export type LongTextQuestionConfig = {
  placeholder?: string;
  maxLength?: number;
};

export type DropdownQuestionConfig = {
  options: string[];
};

export type YesNoQuestionConfig = {
  yesLabel?: string;
  noLabel?: string;
};

export type MatrixQuestionConfig = {
  rows: string[];
  columns: string[];
  multiplePerRow?: boolean;
};

export type RankingQuestionConfig = {
  options: string[];
};

export type DateTimeQuestionConfig = {
  mode: DateTimeMode;
};

export type ConsentQuestionConfig = {
  label: string;
};

export type NumberQuestionConfig = {
  isInteger: boolean;
  isRange: boolean;
  min: number;
  max: number;
};
export type DateTimeMode = "date" | "time" | "datetime";
