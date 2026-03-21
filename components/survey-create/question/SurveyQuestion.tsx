import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { Question } from "@/types/survey-create/question-type";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { CheckBoxSurveyQuestion } from "./question-types/CheckBoxSurveyQuestion";
import QuestionFooter from "./QuestionFooter";
import QuestionHeader from "./QuestionHeader";

interface SurveyQuestionProps {
  info: Question;
  sIndex: number;
  qIndex: number;
}
export default function SurveyQuestion({
  info,
  sIndex,
  qIndex,
}: SurveyQuestionProps) {
  const questionType = useSurveyStore(
    (s) => s.survey.sections[sIndex].questions[qIndex].question_type,
  );

  function getQuestionComponent() {
    if (questionType == "checkbox") {
      return <CheckBoxSurveyQuestion sIndex={sIndex} qIndex={qIndex} />;
    }
    return <>{questionType}</>;
  }

  const [showDesc, setShowDesc] = useState(false);

  return (
    <Card className="mt-3">
      <CardHeader>
        <QuestionHeader
          info={info}
          qIndex={qIndex}
          showDesc={showDesc}
          sIndex={sIndex}
        />
      </CardHeader>
      <CardContent>{getQuestionComponent()}</CardContent>
      <CardFooter className="flex justify-between">
        <QuestionFooter
          questionType={questionType}
          qIndex={qIndex}
          setShowDesc={setShowDesc}
          showDesc={showDesc}
          sIndex={sIndex}
        />
      </CardFooter>
    </Card>
  );
}
