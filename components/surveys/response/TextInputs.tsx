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
  function commitText(value: string) {
    const text = value.trim();
    if (!text) {
      clearAnswer(question.id);
      return;
    }

    setAnswer(question.id, {
      answer_type: "short-text",
      config: { text },
    });
  }

  return (
    <Input
      placeholder={question.config.placeholder}
      maxLength={question.config.maxLength}
      required={question.required}
      onInput={(event) => commitText(event.currentTarget.value)}
      onChange={(event) => commitText(event.target.value)}
    />
  );
}

export function LongTextInput({
  question,
}: {
  question: Question<"long-text">;
}) {
  const { clearAnswer, setAnswer } = useAnswerWriter();
  function commitText(value: string) {
    const text = value.trim();
    if (!text) {
      clearAnswer(question.id);
      return;
    }

    setAnswer(question.id, {
      answer_type: "long-text",
      config: { text },
    });
  }

  return (
    <Textarea
      placeholder={question.config.placeholder ?? "Your answer"}
      maxLength={question.config.maxLength}
      required={question.required}
      onInput={(event) => commitText(event.currentTarget.value)}
      onChange={(event) => commitText(event.target.value)}
    />
  );
}
