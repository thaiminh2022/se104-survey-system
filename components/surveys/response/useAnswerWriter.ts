import { Answer, AnswerForm } from "@/lib/types/answer-type";
import { useFormContext } from "react-hook-form";

export function useAnswerWriter() {
  const form = useFormContext<AnswerForm>();

  return (questionId: string, answer: Answer) => {
    form.setValue(`answers.${questionId}`, answer, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
}
