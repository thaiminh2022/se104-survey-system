import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { useToolbarStore } from "@/stores/survey-create/tool_bar";
import { IconNewSection, IconPlus, IconTextCaption } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function SurveyToolbar() {
  const addSection = useSurveyStore((s) => s.addSection);
  const addQuestion = useSurveyStore((s) => s.addQuestion);
  const activeSectionId = useToolbarStore((s) => s.activeSectionId);

  return (
    <Card className="rounded-lg shadow-lg lg:shadow-sm">
      <CardHeader className="hidden pb-2 lg:block">
        <CardTitle className="text-sm">Builder tools</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 p-3 lg:grid-cols-1 lg:px-4">
        <Button
          type="button"
          className="rounded-md"
          variant="outline"
          disabled={activeSectionId == null}
          onClick={() => {
            if (activeSectionId != null) {
              addQuestion(activeSectionId);
            }
          }}
        >
          <IconPlus />
          <span className="hidden sm:inline">Question</span>
        </Button>

        <Button
          type="button"
          className="rounded-md"
          variant="outline"
          onClick={addSection}
        >
          <IconNewSection />
          <span className="hidden sm:inline">Section</span>
        </Button>

        <Button type="button" className="rounded-md" variant="outline" disabled>
          <IconTextCaption />
          <span className="hidden sm:inline">Text</span>
        </Button>
      </CardContent>
    </Card>
  );
}
