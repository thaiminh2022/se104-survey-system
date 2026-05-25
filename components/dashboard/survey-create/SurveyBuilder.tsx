"use client";

import { useEffect } from "react";
import SurveyHeader from "@/components/dashboard/survey-create/SurveyHeader";
import SurveySection from "@/components/dashboard/survey-create/SurveySection";
import SurveyToolbar from "@/components/dashboard/survey-create/SurveyToolbar";
import { useSurveyStore } from "@/lib/stores/survey_store";
import type { Survey } from "@/lib/types/question-type";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type SurveyBuilderProps =
  | {
      mode: "create";
      initialSurvey?: never;
    }
  | {
      mode: "edit";
      initialSurvey: Survey;
    };

export default function SurveyBuilder({
  mode,
  initialSurvey,
}: SurveyBuilderProps) {
  const survey = useSurveyStore((s) => s.survey);
  const setSurvey = useSurveyStore((s) => s.setSurvey);
  const resetSurvey = useSurveyStore((s) => s.resetSurvey);
  const reorderSections = useSurveyStore((s) => s.reorderSections);
  const questionCount = survey.sections.reduce(
    (total, section) => total + section.questions.length,
    0,
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (mode === "edit") {
      setSurvey(initialSurvey);
      return;
    }

    resetSurvey();
  }, [initialSurvey, mode, resetSurvey, setSurvey]);

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    reorderSections(String(active.id), String(over.id));
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-muted/20">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:px-8">
        <div className="min-w-0 space-y-5 pb-28">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {mode === "edit" ? "Edit survey" : "Survey builder"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {survey.sections.length} sections, {questionCount} questions
              </p>
            </div>
          </div>

          <SurveyHeader mode={mode} />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={survey.sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {survey.sections.map((section, index) => (
                  <SurveySection
                    info={section}
                    key={section.id}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <SurveyToolbar />
          </div>
        </aside>

        <div className="fixed inset-x-4 bottom-4 z-20 lg:hidden">
          <SurveyToolbar />
        </div>
      </div>
    </main>
  );
}
