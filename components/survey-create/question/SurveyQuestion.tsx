import { useToolbarStore } from "@/stores/survey-create/tool_bar";
import { Question } from "@/types/question-type";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { ConsentQuestion } from "./question-types/ConsentQuestion";
import DateTimeQuestion from "./question-types/DateTimeQuestion";
import { DropdownQuestion } from "./question-types/DropdownQuestion";
import { LikertScaleQuestion } from "./question-types/LikertScaleQuestion";
import { LongTextQuestion } from "./question-types/LongTextQuestion";
import { MatrixQuestion } from "./question-types/MatrixQuestion";
import { MultipleChoiceQuestion } from "./question-types/MultipleChoiceQuestion";
import { NumberQuestion } from "./question-types/NumberQuestion";
import { RankingQuestion } from "./question-types/RankingQuestion";
import { RatingScaleQuestion } from "./question-types/RatingScaleQuestion";
import { ShortTextQuestion } from "./question-types/ShortTextQuestion";
import { SingleChoiceQuestion } from "./question-types/SingleChoiceQuestion";
import { YesNoQuestion } from "./question-types/YesNoQuestion";
import QuestionFooter from "./QuestionFooter";
import QuestionHeader from "./QuestionHeader";

interface SurveyQuestionProps {
  info: Question;
  sectionID: string;
  index: number;
}
export default function SurveyQuestion({
  info,
  sectionID,
  index,
}: SurveyQuestionProps) {
  function getQuestionComponent() {
    switch (info.question_type) {
      case "single-choice":
        return <SingleChoiceQuestion questionID={info.id} sectionID={sectionID} />;
      case "multiple-choice":
        return <MultipleChoiceQuestion questionID={info.id} sectionID={sectionID} />;
      case "rating-scale":
        return <RatingScaleQuestion questionID={info.id} sectionID={sectionID} />;
      case "likert-scale":
        return <LikertScaleQuestion questionID={info.id} sectionID={sectionID} />;
      case "short-text":
        return <ShortTextQuestion />;
      case "long-text":
        return <LongTextQuestion />;
      case "dropdown":
        return <DropdownQuestion questionID={info.id} sectionID={sectionID} />;
      case "yes-no":
        return <YesNoQuestion questionID={info.id} sectionID={sectionID} />;
      case "matrix":
        return <MatrixQuestion questionID={info.id} sectionID={sectionID} />;
      case "ranking":
        return <RankingQuestion questionID={info.id} sectionID={sectionID} />;
      case "date-time":
        return <DateTimeQuestion questionID={info.id} sectionID={sectionID} />;
      case "consent":
        return <ConsentQuestion questionID={info.id} sectionID={sectionID} />;
      case "number":
        return <NumberQuestion questionID={info.id} sectionID={sectionID} />;
    }
  }

  const [showDesc, setShowDesc] = useState(false);
  const setActiveQuestionId = useToolbarStore((s) => s.setActiveQuestionId);
  const activeQuestionId = useToolbarStore((s) => s.activeQuestionId);
  const isActive = activeQuestionId === info.id;

  return (
    <Card
      className={[
        "rounded-lg border bg-card shadow-sm transition-all",
        isActive
          ? "border-primary/60 ring-2 ring-primary/15"
          : "hover:border-foreground/20",
      ].join(" ")}
      onClick={() => setActiveQuestionId(info.id)}
      onFocus={() => setActiveQuestionId(info.id)}
    >
      <CardHeader>
        <QuestionHeader
          info={info}
          index={index}
          isActive={isActive}
          showDesc={showDesc}
          sectionID={sectionID}
        />
      </CardHeader>
      {isActive ? (
        <CardContent className="pt-0">{getQuestionComponent()}</CardContent>
      ) : null}

      <CardFooter
        className="border-t bg-muted/20 py-3"
        hidden={!isActive}
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
