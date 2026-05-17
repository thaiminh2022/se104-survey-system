import type { Question } from "@/lib/types/question-type";
import {
  MultipleChoiceInput,
  SingleChoiceInput,
  YesNoInput,
} from "./ChoiceInputs";
import { MatrixInput } from "./MatrixInput";
import { RatingScaleInput, LikertScaleInput } from "./ScaleInputs";
import { DropDownInput, RankingInput } from "./SelectInputs";
import { ConsentInput, DateTimeInput, NumberInput } from "./SpecialInputs";
import { LongTextInput, ShortTextInput } from "./TextInputs";

type Props = {
  question: Question;
};

export function SurveyQuestionInput({ question }: Props) {
  switch (question.question_type) {
    case "single-choice":
      return <SingleChoiceInput question={question} />;
    case "multiple-choice":
      return <MultipleChoiceInput question={question} />;
    case "rating-scale":
      return <RatingScaleInput question={question} />;
    case "likert-scale":
      return <LikertScaleInput question={question} />;
    case "short-text":
      return <ShortTextInput question={question} />;
    case "long-text":
      return <LongTextInput question={question} />;
    case "dropdown":
      return <DropDownInput question={question} />;
    case "yes-no":
      return <YesNoInput question={question} />;
    case "matrix":
      return <MatrixInput question={question} />;
    case "ranking":
      return <RankingInput question={question} />;
    case "date-time":
      return <DateTimeInput question={question} />;
    case "consent":
      return <ConsentInput question={question} />;
    case "number":
      return <NumberInput question={question} />;
  }
}
