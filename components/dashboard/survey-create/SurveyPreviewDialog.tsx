"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SurveyResponseSection } from "@/components/surveys/SurveyResponseSection";
import { AnswerWriterSyncProvider } from "@/components/surveys/response/useAnswerWriter";
import type { AnswerForm } from "@/lib/types/answer-type";
import type { Survey } from "@/lib/types/question-type";
import { IconEye } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

type SurveyPreviewDialogProps = {
  survey: Survey;
};

export default function SurveyPreviewDialog({
  survey,
}: SurveyPreviewDialogProps) {
  const [previewWidth, setPreviewWidth] = useState(520);
  const [isResizing, setIsResizing] = useState(false);
  const answerForm = useForm<AnswerForm>({
    defaultValues: {
      answers: {},
    },
  });

  const updatePreviewWidth = useCallback((clientX: number) => {
    const viewportWidth = window.innerWidth;
    const nextWidth = viewportWidth - clientX;
    const maxWidth = Math.min(viewportWidth * 0.9, 1120);
    const minWidth = Math.min(420, viewportWidth * 0.9);

    setPreviewWidth(Math.min(Math.max(nextWidth, minWidth), maxWidth));
  }, []);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      updatePreviewWidth(event.clientX);
    }

    function handlePointerUp() {
      setIsResizing(false);
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing, updatePreviewWidth]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="rounded-md">
          <IconEye />
          Preview
        </Button>
      </SheetTrigger>
      <SheetContent
        className="overflow-y-auto p-0 sm:max-w-none"
        style={{ width: previewWidth, maxWidth: "90vw" }}
      >
        <div
          role="separator"
          aria-label="Resize preview"
          aria-orientation="vertical"
          className="absolute inset-y-0 left-0 z-10 w-2 cursor-col-resize bg-transparent transition-colors hover:bg-primary/30"
          onPointerDown={(event) => {
            event.preventDefault();
            updatePreviewWidth(event.clientX);
            setIsResizing(true);
          }}
          onDoubleClick={() => setPreviewWidth(720)}
        />
        <SheetHeader className="border-b">
          <SheetTitle className="text-xl">
            {survey.title || "Untitled survey"}
          </SheetTitle>
          <SheetDescription>
            {survey.description ||
              "Preview how respondents will see this survey."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 bg-muted/20 p-6">
          <FormProvider {...answerForm}>
            <AnswerWriterSyncProvider
              value={{
                clearSyncedAnswer() {},
                setSyncedAnswer() {},
              }}
            >
              {survey.sections.length > 0 ? (
                survey.sections.map((section) => (
                  <SurveyResponseSection key={section.id} section={section} />
                ))
              ) : (
                <div className="rounded-lg border border-dashed bg-background p-6 text-center">
                  <p className="font-medium">No sections yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add a section and question to preview the respondent view.
                  </p>
                </div>
              )}
            </AnswerWriterSyncProvider>
          </FormProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
}
