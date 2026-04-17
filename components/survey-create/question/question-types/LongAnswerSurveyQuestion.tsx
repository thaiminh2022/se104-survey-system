import { Textarea } from "@/components/ui/textarea";

export function LongAnswerSurveyQuestion() {
  return (
    <div className="mt-2 w-full">
      <Textarea disabled placeholder="Long answer text" className="border-dashed bg-gray-50/5" />
    </div>
  );
}