import { Input } from "@/components/ui/input";

export function ShortAnswerSurveyQuestion() {
  return (
    <div className="mt-2 w-1/2">
      <Input
        readOnly
        placeholder="Short answer text"
        className="border-dashed bg-gray-50/5"
      />
    </div>
  );
}
