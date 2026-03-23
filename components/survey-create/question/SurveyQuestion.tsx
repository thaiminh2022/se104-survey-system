import { Question } from "@/types/survey-create/question-type";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { CheckBoxSurveyQuestion } from "./question-types/CheckBoxSurveyQuestion";
import DatetimeSurveyQuestion from "./question-types/DatetimeSurveyQuestion";
import { NumberSurveyQuestion } from "./question-types/NumberSurveyQuestion";
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
    }
    return <>{info.question_type}</>;
  }

  const [showDesc, setShowDesc] = useState(false);

  return (
    <Card className="mt-3">
      <CardHeader>
        <QuestionHeader info={info} showDesc={showDesc} sectionID={sectionID} />
      </CardHeader>
      <CardContent>{getQuestionComponent()}</CardContent>
      <CardFooter className="flex justify-between">
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
