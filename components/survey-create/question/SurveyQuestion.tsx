import { useToolbarStore } from "@/stores/survey-create/tool_bar";
import { Question } from "@/types/survey-create/question-type";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { CheckBoxSurveyQuestion } from "./question-types/CheckBoxSurveyQuestion";
import DatetimeSurveyQuestion from "./question-types/DatetimeSurveyQuestion";
import { LongAnswerSurveyQuestion } from "./question-types/LongAnswerSurveyQuestion";
import { MultipleChoiceSurveyQuestion } from "./question-types/MultipleChoiceSurveyQuestion";
import { NumberSurveyQuestion } from "./question-types/NumberSurveyQuestion";
import { ShortAnswerSurveyQuestion } from "./question-types/ShortAnswerSurveyQuestion";
import QuestionFooter from "./QuestionFooter";
import QuestionHeader from "./QuestionHeader";

interface SurveyQuestionProps {
  info: Question;
  sectionID: string;
}
export default function SurveyQuestion({
  info,
  sectionID,
}: SurveyQuestionProps) {
  function getQuestionComponent() {
    if (info.question_type == "checkbox") {
      return (
        <CheckBoxSurveyQuestion questionID={info.id} sectionID={sectionID} />
      );
    } else if (info.question_type == "datetime") {
      return (
        <DatetimeSurveyQuestion questionID={info.id} sectionID={sectionID} />
      );
    } else if (info.question_type === "number") {
      return (
        <NumberSurveyQuestion questionID={info.id} sectionID={sectionID} />
      );
    } else if (info.question_type === "short-answer") {
      return <ShortAnswerSurveyQuestion />;
    } else if (info.question_type === "long-answer") {
      return <LongAnswerSurveyQuestion />;
    } else if (info.question_type === "multiple-choice") {
      return (
        <MultipleChoiceSurveyQuestion
          questionID={info.id}
          sectionID={sectionID}
        />
      );
    }

    return <>{info.question_type}</>;
  }

  const [showDesc, setShowDesc] = useState(false);
  const setActiveQuestionId = useToolbarStore((s) => s.setActiveQuestionId);
  const activeQuestionId = useToolbarStore((s) => s.activeQuestionId);

  return (
    <Card
      className="mt- transition-all"
      style={{
        borderLeft: activeQuestionId == info.id ? "4px solid blue" : "0",
      }}
      onClick={() => setActiveQuestionId(info.id)}
      onFocus={() => setActiveQuestionId(info.id)}
    >
      <CardHeader>
        <QuestionHeader info={info} showDesc={showDesc} sectionID={sectionID} />
      </CardHeader>
      <CardContent>{getQuestionComponent()}</CardContent>

      <CardFooter
        className="flex justify-between"
        hidden={info.id != activeQuestionId}
      >
        <QuestionFooter
          questionType={info.question_type}
          setShowDesc={setShowDesc}
          showDesc={showDesc}
          questionID={info.id}
          sectionID={sectionID}
        />
      </CardFooter>
    </Card>
  );
}
