import { useSurveyStore } from "@/lib/stores/survey_store";
import { useToolbarStore } from "@/lib/stores/tool_bar";
import { QuestionTypes } from "@/lib/types/question-type";
import { IconListDetails, IconNewSection, IconPlus } from "@tabler/icons-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuestionTypeDropdown } from "./question/QuestionTypeDropdown";

export default function SurveyToolbar() {
  const addSection = useSurveyStore((s) => s.addSection);
  const addQuestion = useSurveyStore((s) => s.addQuestion);
  const activeSectionId = useToolbarStore((s) => s.activeSectionId);
  const setActiveQuestionId = useToolbarStore((s) => s.setActiveQuestionId);
  const setActiveSectionId = useToolbarStore((s) => s.setActiveSectionId);

  const [questionType, setQuestionType] = useState<QuestionTypes>("short-text");

  const needsSection = activeSectionId == null;

  return (
    <Card className="rounded-lg shadow-lg lg:shadow-sm">
      <CardHeader className="hidden pb-2 lg:block">
        <CardTitle className="text-sm">Builder tools</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-2 p-3 lg:grid-cols-1 lg:px-4">
        <QuestionTypeDropdown
          value={questionType}
          onValueChange={setQuestionType}
          align="start"
          className="w-full"
        />

        <DisabledToolbarTooltip disabled={needsSection}>
          <Button
            type="button"
            className="w-full rounded-md"
            variant="outline"
            disabled={needsSection}
            onClick={() => {
              if (activeSectionId != null) {
                const id = addQuestion(activeSectionId);
                if (id) setActiveQuestionId(id);
              }
            }}
          >
            <IconPlus />
            <span className="hidden sm:inline">Question</span>
          </Button>
        </DisabledToolbarTooltip>

        <DisabledToolbarTooltip disabled={needsSection}>
          <Button
            type="button"
            className="w-full rounded-md"
            variant="outline"
            disabled={needsSection}
            onClick={() => {
              if (activeSectionId != null) {
                const id = addQuestion(activeSectionId, questionType);
                if (id) setActiveQuestionId(id);
              }
            }}
          >
            <IconListDetails />
            <span className="hidden sm:inline">Chosen type</span>
          </Button>
        </DisabledToolbarTooltip>

        <Button
          type="button"
          className="rounded-md"
          variant="outline"
          onClick={() => {
            const id = addSection();
            setActiveSectionId(id);
          }}
        >
          <IconNewSection />
          <span className="hidden sm:inline">Section</span>
        </Button>
      </CardContent>
    </Card>
  );
}

function DisabledToolbarTooltip({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled: boolean;
}) {
  if (!disabled) {
    return children;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex w-full cursor-not-allowed">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          Select a section or question first.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
