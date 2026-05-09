import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Section } from "@/types/question-type";
import { SurveyQuestionField } from "./SurveyQuestionField";
import type { Answers, AnswerValue } from "./types";

type Props = {
  section: Section;
};

export function SurveyResponseSection({section }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        {section.description ? (
          <CardDescription>{section.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {section.questions.map((question, index) => (
          <SurveyQuestionField
            key={question.id}
            index={index}
            question={question}
          />
        ))}
      </CardContent>
    </Card>
  );
}
