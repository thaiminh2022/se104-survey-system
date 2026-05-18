import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/lib/types/question-type";
import { useAnswerWriter } from "./useAnswerWriter";

export function ShortTextInput({
  question,
}: {
  question: Question<"short-text">;
}) {
  const { clearAnswer, setAnswer } = useAnswerWriter();

  return (
    <Input
      placeholder={question.config.placeholder}
      maxLength={question.config.maxLength}
      required={question.required}
      onChange={(event) => {
        const text = event.target.value.trim();
        if (!text) {
          clearAnswer(question.id);
          return;
        }

        setAnswer(question.id, {
          answer_type: "short-text",
          config: { text },
        });
      }}
    />
  );
}

export function LongTextInput({
  question,
}: {
  question: Question<"long-text">;
}) {
  const { clearAnswer, setAnswer } = useAnswerWriter();

  return (
    <Textarea
      placeholder={question.config.placeholder ?? "Your answer"}
      maxLength={question.config.maxLength}
      required={question.required}
      onChange={(event) => {
        const text = event.target.value.trim();
        if (!text) {
          clearAnswer(question.id);
          return;
        }

        setAnswer(question.id, {
          answer_type: "long-text",
          config: { text },
        });
      }}
    />
  );
}
