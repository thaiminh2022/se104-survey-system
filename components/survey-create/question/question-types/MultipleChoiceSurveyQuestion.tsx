"use client";

import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Circle, X } from "lucide-react";
import { MultipleChoiceQuestionConfig } from "@/types/question-type";

interface Props {
  sectionID: string;
  questionID: string;
}

export function MultipleChoiceSurveyQuestion({ sectionID, questionID }: Props) {
  const survey = useSurveyStore((state) => state.survey);
  const updateQuestionConfig = useSurveyStore((state) => state.updateQuestionConfig);

  // Tìm câu hỏi hiện tại trong store
  const section = survey.sections.find((s) => s.id === sectionID);
  const question = section?.questions.find((q) => q.id === questionID);

  if (!question) return null;

  const config = question.config as MultipleChoiceQuestionConfig;
  const options = config.options || ["Option 1"]; // Lấy options, nếu mảng trống thì để 1 cái mặc định

  // Hàm xử lý gõ chữ vào đáp án
  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    updateQuestionConfig(sectionID, questionID, { ...config, options: newOptions });
  };

  // Hàm thêm đáp án mới
  const handleAddOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    updateQuestionConfig(sectionID, questionID, { ...config, options: newOptions });
  };

  // Hàm xóa đáp án
  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    updateQuestionConfig(sectionID, questionID, { ...config, options: newOptions });
  };

  return (
    <div className="space-y-3 mt-4">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-3">
          <Circle className="w-5 h-5 text-gray-300" />
          <Input
            value={option}
            onChange={(e) => handleUpdateOption(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="flex-1 border-transparent hover:border-b-gray-300 focus-visible:ring-0 focus-visible:border-b-blue-500 rounded-none shadow-none"
          />
          {/* Chỉ hiện nút xóa nếu có nhiều hơn 1 tùy chọn */}
          {options.length > 1 && (
            <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </Button>
          )}
        </div>
      ))}
      
      <div className="flex items-center gap-3 pl-8">
        <Button variant="link" onClick={handleAddOption} className="p-0 h-auto text-blue-500">
          Add option
        </Button>
      </div>
    </div>
  );
}