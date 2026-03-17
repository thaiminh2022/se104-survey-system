"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { submitSurvey } from "@/actions/create_survey";
import SurveySection from "@/components/survey-create/SurveySection";
import SurveyHeader from "@/components/survey-create/SurveyHeader";

export default function Page() {
  const survey = useSurveyStore((s) => s.survey);
  return (
    <div className="w-1/2 ml-auto mr-auto mt-3">
      <SurveyHeader />
      <div>
        {survey.sections.map((e, i) => {
          const idx = i;
          return <SurveySection info={e} sectionIdx={idx} key={i} />;
        })}
      </div>
    </div>
  );
}
