import { Answer, AnswerForm } from "@/lib/types/answer-type";
import { createContext, useContext } from "react";
import { useFormContext } from "react-hook-form";

type AnswerWriterSyncContextValue = {
  setSyncedAnswer: (questionId: string, answer: Answer) => void;
  clearSyncedAnswer: (questionId: string) => void;
};

const AnswerWriterSyncContext =
  createContext<AnswerWriterSyncContextValue | null>(null);

export const AnswerWriterSyncProvider = AnswerWriterSyncContext.Provider;

export function useAnswerWriter() {
  const form = useFormContext<AnswerForm>();
  const sync = useContext(AnswerWriterSyncContext);

  return {
    setAnswer(questionId: string, answer: Answer) {
      sync?.setSyncedAnswer(questionId, answer);
      form.setValue(`answers.${questionId}`, answer, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    clearAnswer(questionId: string) {
      sync?.clearSyncedAnswer(questionId);
      form.unregister(`answers.${questionId}`);
    },
  };
}
