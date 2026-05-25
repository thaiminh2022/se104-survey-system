import { Button } from "@/components/ui/button";
import { useToolbarStore } from "@/lib/stores/tool_bar";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { Question } from "@/lib/types/question-type";
import { IconGripVertical } from "@tabler/icons-react";
import { useState, type CSSProperties } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
        return (
          <SingleChoiceQuestion questionID={info.id} sectionID={sectionID} />
        );
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion questionID={info.id} sectionID={sectionID} />
        );
      case "rating-scale":
        return (
          <RatingScaleQuestion questionID={info.id} sectionID={sectionID} />
        );
      case "likert-scale":
        return (
          <LikertScaleQuestion questionID={info.id} sectionID={sectionID} />
        );
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
  const survey = useSurveyStore((s) => s.survey);
  const setActiveQuestionId = useToolbarStore((s) => s.setActiveQuestionId);
  const activeQuestionId = useToolbarStore((s) => s.activeQuestionId);
  const isActive = activeQuestionId === info.id;
  const questionCount =
    survey.sections.find((section) => section.id === sectionID)?.questions
      .length ?? 0;
  const canDragQuestion = questionCount > 1;
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: info.id, disabled: !canDragQuestion });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={[
        "relative rounded-lg border bg-card shadow-sm transition-all before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-lg before:content-['']",
        isDragging ? "opacity-60" : "",
        isActive
          ? "border-primary/70 ring-2 ring-primary/20 before:bg-primary"
          : "before:bg-transparent hover:border-foreground/20 hover:before:bg-muted-foreground/25",
      ].join(" ")}
      onClick={() => setActiveQuestionId(info.id)}
      onFocus={() => setActiveQuestionId(info.id)}
    >
      <CardHeader>
        <div className="flex items-start gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="mt-1 size-7 shrink-0 cursor-grab touch-none rounded-md active:cursor-grabbing"
            disabled={!canDragQuestion}
            aria-label="Drag question"
            {...attributes}
            {...listeners}
          >
            <IconGripVertical className="size-4" />
          </Button>
          <QuestionHeader
            info={info}
            index={index}
            isActive={isActive}
            showDesc={showDesc}
            sectionID={sectionID}
          />
        </div>
      </CardHeader>
      {isActive ? (
        <CardContent className="pt-0">{getQuestionComponent()}</CardContent>
      ) : null}

      <CardFooter className="border-t bg-muted/20 py-3" hidden={!isActive}>
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
