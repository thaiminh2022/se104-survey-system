import { useSurveyStore } from "@/lib/stores/survey_store";
import { useToolbarStore } from "@/lib/stores/tool_bar";
import { Section } from "@/lib/types/question-type";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SurveyQuestion from "./question/SurveyQuestion";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";

interface SurveySectionProps {
  info: Section;
  index: number;
}

export default function SurveySection({ info, index }: SurveySectionProps) {
  const survey = useSurveyStore((s) => s.survey);
  const deleteSection = useSurveyStore((s) => s.deleteSection);
  const reorderQuestions = useSurveyStore((s) => s.reorderQuestions);
  const updateSectionTitle = useSurveyStore((s) => s.updateSectionTitle);
  const updateSectionDescription = useSurveyStore(
    (s) => s.updateSectionDescription,
  );
  const setActiveSectionId = useToolbarStore((s) => s.setActiveSectionId);
  const activeSectionId = useToolbarStore((s) => s.activeSectionId);
  const isActive = activeSectionId === info.id;
  const canDragSection = survey.sections.length > 1;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: info.id, disabled: !canDragSection });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  function handleQuestionDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    reorderQuestions(info.id, String(active.id), String(over.id));
  }

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={[
        "relative space-y-4 rounded-lg border-l-4 px-4 py-3 transition-colors",
        isDragging ? "opacity-60" : "",
        isActive
          ? "border-l-primary bg-primary/5"
          : "border-l-border bg-transparent hover:bg-muted/30",
      ].join(" ")}
      onFocus={() => setActiveSectionId(info.id)}
      onClick={() => setActiveSectionId(info.id)}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-7 cursor-grab touch-none rounded-md active:cursor-grabbing"
                disabled={!canDragSection}
                aria-label="Drag section"
                {...attributes}
                {...listeners}
              >
                <IconGripVertical className="size-4" />
              </Button>
              <span>Section {index + 1}</span>
            </div>
            <Input
              type="text"
              className="h-auto rounded-none border-x-0 border-t-0 bg-transparent px-0 py-1 text-xl font-semibold shadow-none focus-visible:ring-0"
              placeholder="Section title"
              value={info.title}
              onChange={(event) =>
                updateSectionTitle(info.id, event.target.value)
              }
            />
          </div>
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
        </div>

        {isActive ? (
          <Field className="max-w-3xl">
            <FieldLabel>Section description</FieldLabel>
            <Textarea
              placeholder="Optional context for this section."
              value={info.description}
              onChange={(event) =>
                updateSectionDescription(info.id, event.target.value)
              }
            />
          </Field>
        ) : null}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleQuestionDragEnd}
      >
        <SortableContext
          items={info.questions.map((question) => question.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 pl-0 sm:pl-4">
            {info.questions.map((question, questionIndex) => (
              <SurveyQuestion
                info={question}
                key={question.id}
                sectionID={info.id}
                index={questionIndex}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
