import { useSurveyStore } from "@/stores/survey-create/survey_store";
import {
  Question,
  QuestionTypes,
  QUESTION_TYPES,
} from "@/types/survey-create/question-type";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardAction,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { FieldSet, FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Select,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { CheckBoxSurveyQuestion } from "./question-types/CheckBoxSurveyQuestion";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { IconDots } from "@tabler/icons-react";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ToggleDescription } from "./ToggleDescription";
import { convertQuestionTypeToName } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { boolean } from "zod";

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
  const updateQuestionTitle = useSurveyStore((s) => s.updateQuestionTitle);
  const updateQuestionDescription = useSurveyStore(
    (s) => s.updateQuestionDescription,
  );
  const questionType = useSurveyStore(
    (s) => s.survey.sections[sIndex].questions[qIndex].question_type,
  );
  const updateQuestionType = useSurveyStore((s) => s.updateQuestionType);
  const updateQuestionRequired = useSurveyStore(
    (s) => s.updateQuestionRequired,
  );

  const addQuestion = useSurveyStore((s) => s.addQuestion);
  const deleteQuestion = useSurveyStore((s) => s.deleteQuestion);

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
        <FieldSet className="w-full">
          <FieldGroup>
            <CardTitle>
              <Field>
                <FieldLabel htmlFor="question-title">Question Title</FieldLabel>
                <Input
                  id="question-title"
                  type="text"
                  placeholder="Default"
                  value={info.title}
                  onChange={(e) =>
                    updateQuestionTitle(sIndex, qIndex, e.target.value)
                  }
                />
              </Field>
            </CardTitle>
            <CardDescription hidden={!showDesc}>
              <Field>
                <FieldLabel htmlFor="question-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="question-description"
                  value={info.description}
                  onChange={(e) =>
                    updateQuestionDescription(sIndex, qIndex, e.target.value)
                  }
                />
              </Field>
            </CardDescription>
          </FieldGroup>
        </FieldSet>
      </CardHeader>
      <CardContent>{getQuestionComponent()}</CardContent>
      <CardFooter className="flex justify-between">
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
      </CardFooter>
    </Card>
  );
}
