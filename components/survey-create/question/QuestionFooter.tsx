import { Button } from "@/components/ui/button";
import { CardAction } from "@/components/ui/card";
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
import {
  QUESTION_TYPES,
  QuestionTypes,
} from "@/types/survey-create/question-type";
import { IconDots } from "@tabler/icons-react";
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

  const addQuestion = useSurveyStore((s) => s.addQuestion);
  const deleteQuestion = useSurveyStore((s) => s.deleteQuestion);
  return (
    <>
      <Button type="button" onClick={() => addQuestion(sectionID)}>
        Add question
      </Button>
      <CardAction className="flex gap-x-2">
        <Field orientation={"horizontal"}>
          <FieldLabel htmlFor="required-checkbox">Required</FieldLabel>
          <Checkbox
            id="required-checkbox"
            onCheckedChange={(e) => {
              if (e === true) {
                updateQuestionRequired(sectionID, questionID, true);
              } else if (e === false) {
                updateQuestionRequired(sectionID, questionID, false);
              }
            }}
          />
        </Field>
        <Select
          required
          value={questionType}
          onValueChange={(e) => {
            updateQuestionType(sectionID, questionID, e as QuestionTypes);
          }}
        >
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Question Type</SelectLabel>
              {QUESTION_TYPES.map((e, i) => (
                <SelectItem value={e} key={i}>
                  {convertQuestionTypeToName(e)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <IconDots />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <ToggleDescription check={showDesc} setCheck={setShowDesc} />
            <Button
              variant={"destructive"}
              type="button"
              onClick={() => {
                deleteQuestion(sectionID, questionID);
              }}
            >
              Delete question
            </Button>
          </PopoverContent>
        </Popover>
      </CardAction>
    </>
  );
}
