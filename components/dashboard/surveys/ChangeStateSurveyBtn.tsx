"use client";

import { updateSurveyStatus } from "@/lib/actions/read_survey";
import { SurveyStatus } from "@/lib/types/db_schema";
import { IconSphere } from "@tabler/icons-react";
import ConfirmDialog from "../../dialog/confirm_dialog";
import { Button } from "@/components/ui/button";

type DeleteSurveyButtonProps = {
  surveyId: string;
  state: SurveyStatus;
};

export default function ChangeStateSurveyButton({
  surveyId,
  state,
}: DeleteSurveyButtonProps) {
  async function handleChangeState() {
    let changeTo: SurveyStatus = "draft";

    if (state == "archived") return;

    if (state == "draft") {
      changeTo = "published";
    } else if (state == "published") {
      changeTo = "archived";
    }

    const result = await updateSurveyStatus(surveyId, changeTo);
    if (!result.success) {
      console.log(result.error);
      alert("Cannot change state to: " + changeTo);
    } else {
      alert("Survey is now: " + changeTo);
    }
  }

  function getDescription() {
    if (state == "draft") {
      return "Once a survey is published, you can only archive it. Other people cannot participate in archived surveys";
    } else if (state == "published") {
      return "Once a survey is archived, other people cannot participate in archived surveys. You can't change this back to published";
    }
  }

  function getTitle() {
    const stateText =
      state == "draft"
        ? "Publish"
        : state == "published"
          ? "Archive"
          : "Publish";

    return stateText + " this survey";
  }

  return (
    <ConfirmDialog
      title={getTitle()}
      description={getDescription()}
      confirmText={
        state == "draft"
          ? "Publish"
          : state == "published"
            ? "Archive"
            : "Publish"
      }
      cancelText="Cancel"
      variant="destructive"
      onConfirm={handleChangeState}
    >
      <Button className="rounded-md cursor-pointer">
        <IconSphere />
        {state == "draft"
          ? "Publish"
          : state == "published"
            ? "Archive"
            : "Publish"}
      </Button>
    </ConfirmDialog>
  );
}
