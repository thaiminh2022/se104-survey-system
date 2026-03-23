import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { Section } from "@/types/survey-create/question-type";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import SurveyQuestion from "./question/SurveyQuestion";
import { ToggleDescription } from "./ToggleDescription";

interface SurveySectionProps {
  info: Section;
}
export default function SurveySection({ info }: SurveySectionProps) {
  const addSection = useSurveyStore((s) => s.addSection);
  const deleteSection = useSurveyStore((s) => s.deleteSection);
  const updateSectionTitle = useSurveyStore((s) => s.updateSectionTitle);
  const updateSectionDescription = useSurveyStore(
    (s) => s.updateSectionDescription,
  );

  const [showDesc, setShowDesc] = useState(false);

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
                  onChange={(e) => updateSectionTitle(info.id, e.target.value)}
                />
              </Field>
            </CardTitle>
            <CardDescription hidden={!showDesc}>
              <Field>
                <FieldLabel htmlFor="section-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="section-description"
                  value={info.description}
                  onChange={(e) =>
                    updateSectionDescription(info.id, e.target.value)
                  }
                />
              </Field>
            </CardDescription>
          </FieldGroup>
        </FieldSet>
      </CardHeader>
      <CardContent>
        <CardAction className="flex justify-between w-full">
          <ToggleDescription check={showDesc} setCheck={setShowDesc} />
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => {
              deleteSection(info.id);
            }}
          >
            Delete Section
          </Button>
        </CardAction>
        {info.questions.map((e, i) => {
          return <SurveyQuestion info={e} key={e.id} sectionID={info.id} />;
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
