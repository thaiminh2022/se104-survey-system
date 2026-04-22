"use client";

import { SiteHeader } from "@/components/dashboard/site-header";
import SurveyHeader from "@/components/survey-create/SurveyHeader";
import SurveySection from "@/components/survey-create/SurveySection";
import SurveyToolbar from "@/components/survey-create/SurveyToolbar";
import { useSurveyStore } from "@/stores/survey-create/survey_store";

export default function Page() {
  const survey = useSurveyStore((s) => s.survey);

  return (
    <>
      <SiteHeader header="Create survey" />
      <div className="w-3/4 mx-auto mt-3 pb-24 pt-24">
        <SurveyHeader />
        <div className="my-5 flex flex-col gap-y-5">
          {survey.sections.map((e) => (
            <SurveySection info={e} key={e.id} />
          ))}
        </div>
        <SurveyToolbar />
      </div>
    </>
  );
}
