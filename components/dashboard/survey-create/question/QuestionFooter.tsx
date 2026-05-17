import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSurveyStore } from "@/lib/stores/survey_store";
import { useToolbarStore } from "@/lib/stores/tool_bar";
import { QuestionTypes } from "@/lib/types/question-type";
import { IconDots, IconPlus, IconTrash } from "@tabler/icons-react";
import { ToggleDescription } from "../ToggleDescription";
import { QuestionTypeDropdown } from "./QuestionTypeDropdown";

interface QuestionFooterProps {
  questionType: QuestionTypes;
  setShowDesc: React.Dispatch<React.SetStateAction<boolean>>;
  showDesc: boolean;
  questionID: string;
  sectionID: string;
}

export default function QuestionFooter({
  questionType,
  setShowDesc,
  showDesc,
  questionID,
  sectionID,
}: QuestionFooterProps) {
  const updateQuestionType = useSurveyStore((s) => s.updateQuestionType);
  const updateQuestionRequired = useSurveyStore(
    (s) => s.updateQuestionRequired,
  );
  const survey = useSurveyStore((s) => s.survey);
  const addQuestion = useSurveyStore((s) => s.addQuestion);
  const deleteQuestion = useSurveyStore((s) => s.deleteQuestion);
  const question = survey.sections
    .find((section) => section.id === sectionID)
    ?.questions.find((item) => item.id === questionID);

  const setQuestionFocus = useToolbarStore((t) => t.setActiveQuestionId);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        className="rounded-md"
        onClick={() => {
          const id = addQuestion(sectionID);
          if (id) {
            setQuestionFocus(id);
          }
        }}
      >
        <IconPlus />
        Add question
      </Button>

      <div className="flex items-center gap-3">
        <Field orientation="horizontal" className="gap-2">
          <Checkbox
            id={`required-checkbox-${questionID}`}
            checked={question?.required ?? false}
            onCheckedChange={(checked) =>
              updateQuestionRequired(sectionID, questionID, checked === true)
            }
          />
          <FieldLabel htmlFor={`required-checkbox-${questionID}`}>
            Required
          </FieldLabel>
        </Field>

        <QuestionTypeDropdown
          value={questionType}
          onValueChange={(type) =>
            updateQuestionType(sectionID, questionID, type)
          }
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-md"
            >
              <IconDots />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 space-y-3" align="end">
            <ToggleDescription check={showDesc} setCheck={setShowDesc} />
            <Button
              variant="destructive"
              type="button"
              className="w-full justify-start rounded-md"
              onClick={() => deleteQuestion(sectionID, questionID)}
            >
              <IconTrash />
              Delete question
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
