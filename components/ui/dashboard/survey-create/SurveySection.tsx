import { useSurveyStore } from "@/lib/stores/survey_store";
import { useToolbarStore } from "@/lib/stores/tool_bar";
import { Section } from "@/lib/types/question-type";
import { IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SurveyQuestion from "./question/SurveyQuestion";

interface SurveySectionProps {
  info: Section;
  index: number;
}

export default function SurveySection({ info, index }: SurveySectionProps) {
  const deleteSection = useSurveyStore((s) => s.deleteSection);
  const updateSectionTitle = useSurveyStore((s) => s.updateSectionTitle);
  const updateSectionDescription = useSurveyStore(
    (s) => s.updateSectionDescription,
  );
  const setActiveSectionId = useToolbarStore((s) => s.setActiveSectionId);
  const activeSectionId = useToolbarStore((s) => s.activeSectionId);
  const isActive = activeSectionId === info.id;

  return (
    <section
      className="space-y-3"
      onFocus={() => setActiveSectionId(info.id)}
      onClick={() => setActiveSectionId(info.id)}
    >
      <Card
        className={[
          "rounded-lg shadow-sm transition-colors",
          isActive ? "ring-primary/40" : "",
        ].join(" ")}
      >
        <CardHeader className="gap-4 sm:grid-cols-[1fr_auto]">
          <CardTitle className="space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              Section {index + 1}
            </span>
            <Input
              type="text"
              className="h-auto rounded-none border-x-0 border-t-0 bg-transparent px-0 py-1 text-xl font-semibold shadow-none focus-visible:ring-0"
              placeholder="Section title"
              value={info.title}
              onChange={(event) =>
                updateSectionTitle(info.id, event.target.value)
              }
            />
          </CardTitle>
          <CardAction>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="rounded-md"
              onClick={() => deleteSection(info.id)}
              aria-label="Delete section"
            >
              <IconTrash />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>Section description</FieldLabel>
            <Textarea
              placeholder="Optional context for this section."
              value={info.description}
              onChange={(event) =>
                updateSectionDescription(info.id, event.target.value)
              }
            />
          </Field>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {info.questions.map((question, questionIndex) => (
          <SurveyQuestion
            info={question}
            key={question.id}
            sectionID={info.id}
            index={questionIndex}
          />
        ))}
      </div>
    </section>
  );
}
