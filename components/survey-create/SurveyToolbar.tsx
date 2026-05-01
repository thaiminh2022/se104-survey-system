import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { useToolbarStore } from "@/stores/survey-create/tool_bar";
import { IconNewSection, IconPlus, IconTextCaption } from "@tabler/icons-react";
import { Button } from "../ui/button";

export default function SurveyToolbar() {
  const addSection = useSurveyStore((s) => s.addSection);
  const addQuestion = useSurveyStore((s) => s.addQuestion);
  const activeSectionId = useToolbarStore((s) => s.activeSectionId);

  return (
    <div className="border-2 border-accent-foreground bg-background">
      <Button
        className="rounded-none flex-1"
        variant="outline"
        onClick={() => {
          if (activeSectionId != null) {
            addQuestion(activeSectionId);
          }
        }}
      >
        <IconPlus />
      </Button>

      <Button
        className="rounded-none flex-1"
        variant="outline"
        onClick={addSection}
      >
        <IconNewSection />
      </Button>

      <Button className="rounded-none flex-1" variant="outline">
        <IconTextCaption />
      </Button>
    </div>
  );
}
