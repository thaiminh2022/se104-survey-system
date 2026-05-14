"use client";

import { submitSurvey } from "@/lib/actions/create_survey";
import { useSurveyStore } from "@/stores/survey-create/survey_store";
import { IconDeviceFloppy, IconLoader2, IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

export default function SurveyHeader() {
  const [submittingAction, setSubmittingAction] = useState<
    "draft" | "publish" | null
  >(null);
  const survey = useSurveyStore((s) => s.survey);
  const updateSurveyTitle = useSurveyStore((s) => s.updateSurveyTitle);
  const updateSurveyDescription = useSurveyStore(
    (s) => s.updateSurveyDescription,
  );
  const isSubmitting = submittingAction != null;

  async function handleSubmit(isDraft: boolean) {
    setSubmittingAction(isDraft ? "draft" : "publish");
    try {
      const result = await submitSurvey(survey, isDraft);
      if (!result.success) {
        toast.error(`Survey creation error: ${result.message}`);
      } else {
        toast.info(`Survey saved as: ${isDraft ? "Draft" : "Published"}`);
      }
    } finally {
      setSubmittingAction(null);
    }
  }

  return (
    <Card className="rounded-lg border-l-4 border-l-primary shadow-sm">
      <CardHeader className="gap-4 sm:grid-cols-[1fr_auto]">
        <CardTitle className="space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Survey
          </span>
          <Input
            type="text"
            className="h-auto rounded-none border-x-0 border-t-0 bg-transparent px-0 py-1 text-3xl font-semibold shadow-none focus-visible:ring-0"
            placeholder="Survey title"
            value={survey.title}
            onChange={(event) => updateSurveyTitle(event.target.value)}
          />
        </CardTitle>
        <CardAction className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-md"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
          >
            {submittingAction === "draft" ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              <IconDeviceFloppy />
            )}
            {submittingAction === "draft" ? "Saving..." : "Draft"}
          </Button>
          <Button
            className="rounded-md"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
          >
            {submittingAction === "publish" ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              <IconSend />
            )}
            {submittingAction === "publish" ? "Publishing..." : "Publish"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>Intro description</FieldLabel>
            <Textarea
              placeholder="Tell respondents what this survey is about."
              value={survey.description}
              onChange={(event) => updateSurveyDescription(event.target.value)}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
