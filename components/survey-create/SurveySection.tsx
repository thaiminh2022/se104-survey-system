import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { Section } from "@/types/survey-create/question-type";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { FieldSet, FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import SurveyQuestion from "./SurveyQuestion";

interface SurveySectionProps {
  info: Section;
  sectionIdx: number;
}
export default function SurveySection({
  info,
  sectionIdx,
}: SurveySectionProps) {
  const addSection = useSurveyStore((s) => s.addSection);
  const updateSectionTitle = useSurveyStore((s) => s.updateSectionTitle);
  const updateSectionDescription = useSurveyStore(
    (s) => s.updateSectionDescription,
  );

  return (
    <Card className="bg-transparent border-none mt-3">
      <CardHeader>
        <FieldSet className="w-full">
          <FieldGroup>
            <CardTitle>
              <Field>
                <FieldLabel htmlFor="section-title">Section Title</FieldLabel>
                <Input
                  id="section-title"
                  type="text"
                  placeholder="Default"
                  value={info.title}
                  onChange={(e) =>
                    updateSectionTitle(sectionIdx, e.target.value)
                  }
                />
              </Field>
            </CardTitle>
            <CardDescription>
              <Field>
                <FieldLabel htmlFor="section-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="section-description"
                  value={info.description}
                  onChange={(e) =>
                    updateSectionDescription(sectionIdx, e.target.value)
                  }
                />
              </Field>
            </CardDescription>
          </FieldGroup>
        </FieldSet>
      </CardHeader>
      <CardContent>
        {info.questions.map((e, i) => {
          const idx = i;
          return (
            <SurveyQuestion info={e} qIndex={idx} sIndex={sectionIdx} key={i} />
          );
        })}
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={addSection}
          variant="outline"
          className="w-full"
        >
          Add Section
        </Button>
      </CardFooter>
    </Card>
  );
}
