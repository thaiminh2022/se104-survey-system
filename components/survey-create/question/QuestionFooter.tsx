import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertQuestionTypeToName } from "@/lib/helper";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { QUESTION_TYPES, QuestionTypes } from "@/types/question-type";
import { IconDots, IconPlus, IconTrash } from "@tabler/icons-react";
import { ToggleDescription } from "../ToggleDescription";

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

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        className="rounded-md"
        onClick={() => addQuestion(sectionID)}
      >
        <IconPlus />
        Add question
      </Button>

      <div className="flex flex-wrap items-center gap-3">
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

        <Select
          required
          value={questionType}
          onValueChange={(value) =>
            updateQuestionType(sectionID, questionID, value as QuestionTypes)
          }
        >
          <SelectTrigger className="w-52 rounded-md">
            <SelectValue placeholder="Select a question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Question Type</SelectLabel>
              {QUESTION_TYPES.map((type) => (
                <SelectItem value={type} key={type}>
                  {convertQuestionTypeToName(type)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="rounded-md">
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
