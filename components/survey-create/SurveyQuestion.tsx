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
  const addQuestion = useSurveyStore((s) => s.addQuestion);

  function getQuestionComponent() {
    if (questionType == "checkbox") {
      return <CheckBoxSurveyQuestion sIndex={sIndex} qIndex={qIndex} />;
    }
    return <>{questionType}</>;
  }

  return (
    <Card className="mt-3">
      <CardHeader>
        <CardAction>
          <Select
            required
            value={questionType}
            onValueChange={(e) => {
              updateQuestionType(sIndex, qIndex, e as QuestionTypes);
            }}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Question Type</SelectLabel>
                {QUESTION_TYPES.map((e, i) => (
                  <SelectItem value={e} key={i}>
                    {e}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
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
            <CardDescription>
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
      <CardFooter>
        <Button type="button" onClick={() => addQuestion(sIndex)}>
          Add question
        </Button>
      </CardFooter>
    </Card>
  );
}
