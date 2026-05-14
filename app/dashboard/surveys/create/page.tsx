"use client";

import { SiteHeader } from "@/components/dashboard/site-header";
import SurveyHeader from "@/components/dashboard/survey-create/SurveyHeader";
import SurveySection from "@/components/dashboard/survey-create/SurveySection";
import SurveyToolbar from "@/components/dashboard/survey-create/SurveyToolbar";
import { useSurveyStore } from "@/stores/survey-create/survey_store";

export default function Page() {
  const survey = useSurveyStore((s) => s.survey);
  const questionCount = survey.sections.reduce(
    (total, section) => total + section.questions.length,
    0,
  );

  return (
    <>
      <SiteHeader header="Create survey" />
      <main className="min-h-[calc(100svh-4rem)] bg-muted/20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:px-8">
          <div className="min-w-0 space-y-5 pb-28">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Survey builder
                </h1>
                <p className="text-sm text-muted-foreground">
                  {survey.sections.length} sections, {questionCount} questions
                </p>
              </div>
            </div>

            <SurveyHeader />

            <div className="space-y-6">
              {survey.sections.map((section, index) => (
                <SurveySection info={section} key={section.id} index={index} />
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <SurveyToolbar />
            </div>
          </aside>

          <div className="fixed inset-x-4 bottom-4 z-20 lg:hidden">
            <SurveyToolbar />
          </div>
        </div>
      </main>
    </>
  );
}
