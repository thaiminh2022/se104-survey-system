"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { IconGripVertical, IconX } from "@tabler/icons-react";
import type { CSSProperties } from "react";

type Props = {
  options: string[];
  label?: string;
  onChange: (options: string[]) => void;
};

export function OptionListEditor({ options, label = "Option", onChange }: Props) {
  const values = options.length > 0 ? options : [`${label} 1`];
  const itemIds = values.map((option, index) => getOptionItemId(index, option));
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = getOptionIndexFromId(String(active.id));
    const overIndex = getOptionIndexFromId(String(over.id));
    onChange(reorderByIndex(values, activeIndex, overIndex));
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {values.map((option, index) => (
              <SortableOption
                canDrag={values.length > 1}
                id={itemIds[index]}
                index={index}
                key={itemIds[index]}
                label={label}
                onChange={onChange}
                option={option}
                values={values}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="link"
        className="h-auto p-0"
        onClick={() => onChange([...values, `${label} ${values.length + 1}`])}
      >
        Add {label.toLowerCase()}
      </Button>
    </div>
  );
}

function SortableOption({
  canDrag,
  id,
  index,
  label,
  onChange,
  option,
  values,
}: {
  canDrag: boolean;
  id: string;
  index: number;
  label: string;
  onChange: (options: string[]) => void;
  option: string;
  values: string[];
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, disabled: !canDrag });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "flex items-center gap-3",
        isDragging ? "opacity-60" : "",
      ].join(" ")}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!canDrag}
        className="size-8 shrink-0 cursor-grab touch-none rounded-md active:cursor-grabbing"
        aria-label={`Drag ${label.toLowerCase()}`}
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="size-4" />
      </Button>
      <Input
        value={option}
        onChange={(event) => {
          const next = [...values];
          next[index] = event.target.value;
          onChange(next);
        }}
        placeholder={`${label} ${index + 1}`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={values.length <= 1}
        onClick={() => onChange(values.filter((_, i) => i !== index))}
      >
        <IconX className="size-4" />
      </Button>
    </div>
  );
}

function getOptionItemId(index: number, option: string) {
  return `${index}:${option}`;
}

function getOptionIndexFromId(id: string) {
  return Number(id.split(":", 1)[0]);
}

function reorderByIndex<T>(items: T[], activeIndex: number, overIndex: number) {
  if (
    activeIndex < 0 ||
    overIndex < 0 ||
    activeIndex >= items.length ||
    overIndex >= items.length ||
    activeIndex === overIndex
  ) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(activeIndex, 1);
  next.splice(overIndex, 0, moved);

  return next;
}
