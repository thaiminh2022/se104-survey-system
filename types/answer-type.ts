import { QuestionTypes } from "./question-type";

export type AnswerConfigByType = {
  "short-answer": ShortAnswerConfig;
  "long-answer": LongAnswerConfig;
  "multiple-choice": MultipleChoiceConfig;
  checkbox: CheckBoxConfig;
  dropdown: DropdownAnswerConfig;
  datetime: DatetimeAnswerConfig;
  number: NumberAnswerConfig;
  rating: RatingConfig;
};

export type Answer<TType extends QuestionTypes = QuestionTypes> = {
  [K in TType]: {
    answer_type: K;
    config: AnswerConfigByType[K];
  };
}[TType];

export type AnswerForm = {
  answers: Record<string, Answer>;
};

type ShortAnswerConfig = {
  answer: string;
};
type LongAnswerConfig = {
  answer: string;
};
type MultipleChoiceConfig =
  | {
      use_other: false;
      selected_option: string;
    }
  | {
      use_other: true;
      other_answer: string;
    };
type CheckBoxConfig =
  | {
      selected_options: string[];
      use_other: false;
    }
  | {
      use_other: true;
      other_answer: string;
    };
type DropdownAnswerConfig = {
  selected_option: string;
};
type DatetimeAnswerConfig = {
  answer: Date;
};
type NumberAnswerConfig = {
  answer: number;
};
type RatingConfig = {
  rating: number; // Assuming a rating scale, e.g., 1-5
};
