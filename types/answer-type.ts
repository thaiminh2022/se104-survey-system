import { QuestionTypes } from "./question-type";

export type AnswerConfigByType = {
  "single-choice": SingleChoiceAnswerConfig;
  "multiple-choice": MultipleChoiceConfig;
  "rating-scale": RatingScaleAnswerConfig;
  "likert-scale": LikertScaleAnswerConfig;
  "short-text": ShortTextAnswerConfig;
  "long-text": LongTextAnswerConfig;
  dropdown: DropdownAnswerConfig;
  "yes-no": YesNoAnswerConfig;
  matrix: MatrixAnswerConfig;
  ranking: RankingAnswerConfig;
  "date-time": DateTimeAnswerConfig;
  consent: ConsentAnswerConfig;
  number: NumberAnswerConfig;
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

type SingleChoiceAnswerConfig =
  | {
      use_other: false;
      selected_option: string;
    }
  | {
      use_other: true;
      other_answer: string;
    };

type MultipleChoiceConfig =
  | {
      selected_options: string[];
      use_other: false;
    }
  | {
      use_other: true;
      other_answer: string;
    };

type RatingScaleAnswerConfig = {
  rating: number;
};

type LikertScaleAnswerConfig = {
  selected_option: string;
};

type ShortTextAnswerConfig = {
  text: string;
};

type LongTextAnswerConfig = {
  text: string;
};

type DropdownAnswerConfig = {
  selected_option: string;
};

type YesNoAnswerConfig = {
  value: boolean;
};

type MatrixAnswerConfig = {
  rows: Record<string, string | string[]>;
};

type RankingAnswerConfig = {
  ranked_options: string[];
};

type DateTimeAnswerConfig = {
  value: string;
};

type ConsentAnswerConfig = {
  accepted: boolean;
};

type NumberAnswerConfig =
  | {
      is_range: false;
      answer: number;
    }
  | {
      is_range: true;
      from: number;
      to: number;
    };
