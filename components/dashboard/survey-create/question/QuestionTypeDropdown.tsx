import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertQuestionTypeToName } from "@/lib/helper";
import { QuestionTypes } from "@/types/question-type";
import { IconChevronDown } from "@tabler/icons-react";

const QUESTION_TYPE_GROUPS: { label: string; types: QuestionTypes[] }[] = [
  {
    label: "Choice",
    types: [
      "single-choice",
      "multiple-choice",
      "dropdown",
      "yes-no",
      "ranking",
    ],
  },
  {
    label: "Scale",
    types: ["rating-scale", "likert-scale", "matrix"],
  },
  {
    label: "Text",
    types: ["short-text", "long-text"],
  },
  {
    label: "Special",
    types: ["date-time", "consent", "number"],
  },
];

type Props = {
  value: QuestionTypes;
  onValueChange: (type: QuestionTypes) => void;
  align?: "start" | "center" | "end";
  className?: string;
};

export function QuestionTypeDropdown({
  value,
  onValueChange,
  align = "end",
  className = "w-52",
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`${className} justify-between rounded-md`}
        >
          <span className="truncate">{convertQuestionTypeToName(value)}</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={align}>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) =>
            onValueChange(nextValue as QuestionTypes)
          }
        >
          {QUESTION_TYPE_GROUPS.map((group) => (
            <DropdownMenuSub key={group.label}>
              <DropdownMenuSubTrigger>{group.label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                {group.types.map((type) => (
                  <DropdownMenuRadioItem value={type} key={type}>
                    {convertQuestionTypeToName(type)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
