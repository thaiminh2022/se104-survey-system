"use client";

import { SiteHeader } from "@/components/dashboard/site-header";
import SurveyHeader from "@/components/survey-create/SurveyHeader";
import SurveySection from "@/components/survey-create/SurveySection";
import { useSurveyStore } from "@/stores/survey-create/survey_store";

export default function Page() {
  const survey = useSurveyStore((s) => s.survey);
  return (
    <>
      <SiteHeader header="Create survey" />
      <div className="w-3/4 ml-auto mr-auto mt-3">
        <SurveyHeader />
        <div>
          {survey.sections.map((e, i) => {
            const idx = i;
            return <SurveySection info={e} sectionIdx={idx} key={i} />;
          })}
        </div>
      </div>
    </>
  );
}
