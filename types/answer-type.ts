import { QuestionConfigByType, QuestionTypes } from "./question-type";

export type AnswerConfigByType = {
  "short-answer": ShortAnswerConfig;
  "long-answer": LongAnswerConfig;
  "multiple-choice": MultipleChoiceConfig;
  "checkbox": CheckBoxConfig;
  "dropdown": DropdownAnswerConfig;
  "datetime": DatetimeAnswerConfig;
  "number": NumberAnswerConfig;
  "rating": RatingConfig;
};


export type Answer<TType extends QuestionTypes = QuestionTypes> = {
  [K in TType]: {
    question_id: string;
    answer_type: K;
    config: AnswerConfigByType[K];
  };
}[TType];


type ShortAnswerConfig = {
  answer: string;
};
type LongAnswerConfig = {
  answer: string;
}
type MultipleChoiceConfig = {
  selected_option: string;
};
type CheckBoxConfig = {
  selected_options: string[];
};
type DropdownAnswerConfig = {
  selected_option: string;
};
type DatetimeAnswerConfig = {
  answer: string; // ISO 8601 format
};
type NumberAnswerConfig = {
  answer: number;
};
type RatingConfig = {
  rating: number; // Assuming a rating scale, e.g., 1-5
};
