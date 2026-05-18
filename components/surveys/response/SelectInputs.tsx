import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Question } from "@/lib/types/question-type";
import { useState } from "react";
import { useAnswerWriter } from "./useAnswerWriter";

export function DropDownInput({ question }: { question: Question<"dropdown"> }) {
  const { clearAnswer, setAnswer } = useAnswerWriter();

  return (
    <Select
      required={question.required}
      onValueChange={(value) => {
        if (!question.config.options.includes(value)) {
          clearAnswer(question.id);
          return;
        }

        setAnswer(question.id, {
          answer_type: "dropdown",
          config: { selected_option: value },
        });
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {question.config.options.map((option) => (
          <SelectItem value={option} key={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function RankingInput({ question }: { question: Question<"ranking"> }) {
  const { clearAnswer, setAnswer } = useAnswerWriter();
  const [rankedOptions, setRankedOptions] = useState<string[]>([]);

  function updateRank(index: number, value: string) {
    if (!question.config.options.includes(value)) {
      return;
    }

    const next = [...rankedOptions];
    next[index] = value;
    const ranked = next.filter(Boolean);
    const uniqueRanked = Array.from(new Set(ranked));
    setRankedOptions(next);
    if (uniqueRanked.length === 0) {
      clearAnswer(question.id);
      return;
    }

    setAnswer(question.id, {
      answer_type: "ranking",
      config: { ranked_options: uniqueRanked },
    });
  }

  return (
    <div className="space-y-3">
      {question.config.options.map((_, index) => (
        <div className="flex items-center gap-3" key={index}>
          <span className="w-8 text-sm text-muted-foreground">
            #{index + 1}
          </span>
          <Select onValueChange={(value) => updateRank(index, value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {question.config.options.map((option) => (
                <SelectItem
                  value={option}
                  key={option}
                  disabled={rankedOptions.includes(option)}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
