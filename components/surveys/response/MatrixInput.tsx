import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "@/types/question-type";
import { useState } from "react";
import { useAnswerWriter } from "./useAnswerWriter";

export function MatrixInput({ question }: { question: Question<"matrix"> }) {
  const setAnswer = useAnswerWriter();
  const [rows, setRows] = useState<Record<string, string | string[]>>({});

  function updateRow(row: string, value: string, checked?: boolean) {
    const next = { ...rows };
    if (question.config.multiplePerRow) {
      const current = Array.isArray(next[row]) ? next[row] : [];
      next[row] = checked
        ? [...current, value]
        : current.filter((item) => item !== value);
    } else {
      next[row] = value;
    }
    setRows(next);
    setAnswer(question.id, {
      answer_type: "matrix",
      config: { rows: next },
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-130 text-sm">
        <thead>
          <tr>
            <th className="py-2 text-left font-medium"></th>
            {question.config.columns.map((column) => (
              <th className="px-3 py-2 text-center font-medium" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.config.rows.map((row) => (
            <tr className="border-t" key={row}>
              <td className="py-3 pr-3 font-medium">{row}</td>
              {question.config.columns.map((column) => (
                <td className="px-3 py-3 text-center" key={column}>
                  {question.config.multiplePerRow ? (
                    <Checkbox
                      checked={
                        Array.isArray(rows[row]) && rows[row].includes(column)
                      }
                      onCheckedChange={(checked) =>
                        updateRow(row, column, checked === true)
                      }
                    />
                  ) : (
                    <RadioGroup
                      value={typeof rows[row] === "string" ? rows[row] : ""}
                      onValueChange={(value) => updateRow(row, value)}
                    >
                      <RadioGroupItem value={column} />
                    </RadioGroup>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
