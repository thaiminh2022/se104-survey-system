import { Button } from "@/components/ui/button";
import { CardAction } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { convertQuestionTypeToName } from "@/lib/utils";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import {
  QuestionTypes,
  QUESTION_TYPES,
} from "@/types/survey-create/question-type";
import { IconDots } from "@tabler/icons-react";
import { ToggleDescription } from "../ToggleDescription";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestionFooterProps {
  qIndex: number;
  questionType: QuestionTypes;
  setShowDesc: React.Dispatch<React.SetStateAction<boolean>>;
  showDesc: boolean;
  sIndex: number;
}

export default function QuestionFooter({
  qIndex,
  questionType,
  setShowDesc,
  showDesc,
  sIndex,
}: QuestionFooterProps) {
  const updateQuestionType = useSurveyStore((s) => s.updateQuestionType);
  const updateQuestionRequired = useSurveyStore(
    (s) => s.updateQuestionRequired,
  );

  const addQuestion = useSurveyStore((s) => s.addQuestion);
  const deleteQuestion = useSurveyStore((s) => s.deleteQuestion);
  return (
    <>
      <Button type="button" onClick={() => addQuestion(sIndex)}>
        Add question
      </Button>
      <CardAction className="flex gap-x-2">
        <Field orientation={"horizontal"}>
          <FieldLabel htmlFor="required-checkbox">Required</FieldLabel>
          <Checkbox
            id="required-checkbox"
            onCheckedChange={(e) => {
              if (e === true) {
                updateQuestionRequired(sIndex, qIndex, true);
              } else if (e === false) {
                updateQuestionRequired(sIndex, qIndex, false);
              }
            }}
          />
        </Field>
        <Select
          required
          value={questionType}
          onValueChange={(e) => {
            updateQuestionType(sIndex, qIndex, e as QuestionTypes);
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
                deleteQuestion(sIndex, qIndex);
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
