import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { useToolbarStore } from "@/stores/survey-create/tool_bar";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import SurveyQuestion from "./question/SurveyQuestion";
import { Section } from "@/types/question-type";

interface SurveySectionProps {
  info: Section;
}
export default function SurveySection({ info }: SurveySectionProps) {
  const deleteSection = useSurveyStore((s) => s.deleteSection);
  const updateSectionTitle = useSurveyStore((s) => s.updateSectionTitle);
  const updateSectionDescription = useSurveyStore(
    (s) => s.updateSectionDescription,
  );

  const setActiveSectionId = useToolbarStore((s) => s.setActiveSectionId);

  return (
    <div
      onFocus={(e) => {
        setActiveSectionId(info.id);
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <input
              type="text"
              className="text-xl w-full focus:outline-0 border-b-accent border-b-2 focus:border-b-accent-foreground transition-colors"
              placeholder="Survey title"
              value={info.title}
              onChange={(e) => updateSectionTitle(info.id, e.target.value)}
            />
          </CardTitle>
          <CardAction>
            <Button
              className="rounded-md"
              variant={"destructive"}
              onClick={() => deleteSection(info.id)}
            >
              Delete
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <textarea
            placeholder="Section description"
            className="w-full focus:outline-0 h-5 transitions-color border-b-accent border-b-2 focus:border-b-accent-foreground"
            value={info.description}
            onChange={(e) => updateSectionDescription(info.id, e.target.value)}
          />
        </CardContent>
      </Card>
      <div className="flex flex-col gap-y-5">
        {info.questions.map((e, i) => {
          return <SurveyQuestion info={e} key={i} sectionID={info.id} />;
        })}
      </div>
    </div>
  );
}
